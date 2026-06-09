import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import pkg from '../package.json' with { type: 'json' }

const BASE_URL = 'https://www.xiaoluxuanfang.com'
const APP_DIR = join(homedir(), '.xiaolu-house')
const CONFIG_FILE = join(APP_DIR, 'config')
const CACHE_FILE = join(APP_DIR, 'cache.json')
const REQUEST_INTERVAL_MS = 1000
const CACHE_MS = 10 * 60 * 1000

let nextRequestAt = 0

function decodeConfig(str) {
  try {
    return JSON.parse(Buffer.from(str.trim(), 'base64').toString('utf-8'))
  } catch {
    return {}
  }
}

export function encodeBase64Json(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

export function decodeBase64Json(str) {
  return decodeConfig(str)
}

function getLocalConfig() {
  if (!existsSync(CONFIG_FILE)) return {}
  try {
    return decodeBase64Json(readFileSync(CONFIG_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

function ensureAppDir() {
  if (!existsSync(APP_DIR)) {
    mkdirSync(APP_DIR, { recursive: true })
  }
}

export function clearConfig() {
  ensureAppDir()
  writeFileSync(CONFIG_FILE, '', 'utf-8')
}

export function clearCache() {
  ensureAppDir()
  writeFileSync(CACHE_FILE, '', 'utf-8')
}

export function getConfig() {
  return getLocalConfig()
}

export function saveConfig(data) {
  ensureAppDir()
  writeFileSync(CONFIG_FILE, encodeBase64Json(data), 'utf-8')
}

function getCacheStore() {
  if (!existsSync(CACHE_FILE)) return {}
  try {
    const content = readFileSync(CACHE_FILE, 'utf-8').trim()
    if (!content) return {}
    return decodeBase64Json(content)
  } catch {
    return {}
  }
}

function saveCacheStore(store) {
  ensureAppDir()
  writeFileSync(CACHE_FILE, encodeBase64Json(store), 'utf-8')
}

async function waitForRequestSlot() {
  const now = Date.now()
  const waitMs = Math.max(0, nextRequestAt - now)
  nextRequestAt = Math.max(now, nextRequestAt) + REQUEST_INTERVAL_MS
  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }
}

async function requestText(path, options) {
  await waitForRequestSlot()

  const url = `${BASE_URL}${path}`
  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type') || ''
  const rawText = await response.text()
  const normalized = normalizeResponse(rawText, contentType)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${normalized.errorText}`)
  }

  return normalized.outputText
}

function normalizeResponse(rawText, contentType) {
  const trimmed = rawText.trim()
  const mayBeJsonText = trimmed.startsWith('{') || trimmed.startsWith('[')
  const maybeJson =
    contentType.includes('application/json') || mayBeJsonText
      ? safeParseJson(rawText)
      : null

  const content =
    maybeJson && typeof maybeJson.content === 'string'
      ? maybeJson.content
      : null
  const message =
    maybeJson && typeof maybeJson.message === 'string'
      ? maybeJson.message
      : null
  const error =
    maybeJson && typeof maybeJson.error === 'string' ? maybeJson.error : null

  const outputText = content ?? rawText
  const errorText = content ?? rawText ?? message ?? error ?? '未知错误'

  return { outputText, errorText }
}

function safeParseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * 获取 API Key
 * 从本地配置文件读取
 */
export function getApiKey() {
  const key = getLocalConfig().apiKey
  if (key) return key
  throw new Error(
    '缺少 API Key\n请先配置: `xiaolu-house config --set-api-key <your-api-key>`',
  )
}

function getApiKeyHeaders() {
  const key = getLocalConfig().apiKey
  return key ? { 'X-Fg-Api-Key': key } : {}
}

/**
 * 获取城市配置（必填）
 */
export function getCity() {
  const city = getLocalConfig().city
  if (city) return city
  throw new Error(
    '城市未配置\n请先配置: `xiaolu-house config --set-city <your-city>`\n可用城市: `xiaolu-house cities`',
  )
}

/**
 * 发起 POST 请求
 * @param {string} path - API 路径
 * @param {object} data - 请求体数据
 */
export async function apiPost(path, data) {
  return requestText(path, {
    method: 'POST',
    headers: {
      Accept: 'text/markdown',
      'Content-Type': 'application/json',
      'User-Agent': `${pkg.name}/${pkg.version}`,
      ...getApiKeyHeaders(),
    },
    body: JSON.stringify(data),
  })
}

/**
 * 发起 GET 请求
 * @param {string} path - API 路径
 */
export async function apiGet(path) {
  return requestText(path, {
    method: 'GET',
    headers: {
      Accept: 'text/markdown',
      'Content-Type': 'application/json',
      'User-Agent': `${pkg.name}/${pkg.version}`,
      ...getApiKeyHeaders(),
    },
  })
}

function getCachedValue(cacheKey) {
  const store = getCacheStore()
  const cached = store[cacheKey]

  if (
    cached &&
    typeof cached.value === 'string' &&
    typeof cached.expiresAt === 'number' &&
    cached.expiresAt > Date.now()
  ) {
    return cached.value
  }

  return null
}

function setCachedValue(cacheKey, value, ttlMs) {
  const store = getCacheStore()

  store[cacheKey] = {
    value,
    expiresAt: Date.now() + ttlMs,
  }
  saveCacheStore(store)
}

export async function apiGetWithCache(path, cacheKey, options = {}) {
  const ttlMs = options.ttlMs || CACHE_MS
  const cached = getCachedValue(cacheKey)
  if (cached) return cached

  const value = await apiGet(path)
  setCachedValue(cacheKey, value, ttlMs)
  return value
}

export async function validateCity(city) {
  const normalizedCity = String(city || '').trim()

  if (!normalizedCity) {
    throw new Error(
      '城市未配置\n请先配置: `xiaolu-house config --set-city <your-city>`\n可用城市: `xiaolu-house cities`',
    )
  }

  const result = await apiGetWithCache('/mcp-api/cities', 'cities')
  const cityMatched = String(result || '')
    .split('\n')
    .some((line) => /^-\s+(.+?)\s*$/.exec(line)?.[1] === normalizedCity)

  if (!cityMatched) {
    throw new Error(
      `不支持的城市名称: ${normalizedCity}\n可用城市请查看: \`xiaolu-house cities\``,
    )
  }

  return normalizedCity
}

/**
 * 打印 Markdown 文本（直接输出）
 */
export function printResult(text) {
  if (!text || text.trim() === '') {
    console.log('暂无数据')
    return
  }
  console.log(text)
}

/**
 * 统一错误处理
 */
export function handleError(err) {
  console.error(`[ERROR] ${err.message}`)
  process.exitCode = 1
}

/**
 * 清理 undefined 字段
 */
export function cleanParams(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0),
    ),
  )
}
