import { existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { createRequire } from 'module'

// __dirname 在 CJS 运行时可用，import.meta.url 在 ESM 源码时可用
const _require = createRequire(import.meta.url || __filename)
const pkg = _require('../package.json')

const BASE_URL = 'https://www.xiaoluxuanfang.com'
const CONFIG_FILE = join(homedir(), '.xiaolu-house', 'config')

function decodeConfig(str) {
  try {
    return JSON.parse(Buffer.from(str.trim(), 'base64').toString('utf-8'))
  } catch {
    return {}
  }
}

function getLocalConfig() {
  if (!existsSync(CONFIG_FILE)) return {}
  try {
    return decodeConfig(readFileSync(CONFIG_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

/**
 * 获取 API Key
 * 从本地配置文件读取
 */
export function getApiKey() {
  const key = getLocalConfig().apiKey
  if (!key) {
    console.error('[ERROR] 缺少 API Key')
    console.error('请先配置: `xiaolu-house config --set-api-key <your-api-key>`')
    process.exit(1)
  }
  return key
}

/**
 * 获取城市配置（必填）
 */
export function getCity() {
  const city = getLocalConfig().city
  if (!city) {
    console.error('[ERROR] 城市未配置')
    console.error('请先配置: `xiaolu-house config --set-city <your-city>`')
    console.error('可用城市: `xiaolu-house cities`')
    process.exit(1)
  }
  return city
}

/**
 * 发起 POST 请求
 */
export async function apiPost(path, data, apiKey) {
  const url = `${BASE_URL}${path}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Fg-Api-Key': apiKey,
      'User-Agent': `${pkg.name}/${pkg.version}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`HTTP ${response.status}: ${text}`)
  }

  return response.text()
}

/**
 * 打印 Markdown 文本（直接输出）
 */
export function printResult(text) {
  if (!text || text.trim() === '') {
    console.log('没有找到相关结果')
    return
  }
  console.log(text)
}

/**
 * 统一错误处理
 */
export function handleError(err) {
  if (err.message?.includes('401')) {
    console.error('[ERROR] API Key 无效或已过期，请检查 API Key')
  } else if (err.message?.includes('429')) {
    console.error('[ERROR] 请求频率过高，请稍后再试')
  } else {
    console.error(`[ERROR] 请求失败: ${err.message}`)
  }
  process.exit(1)
}

/**
 * 清理 undefined 字段
 */
export function cleanParams(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0))
  )
}
