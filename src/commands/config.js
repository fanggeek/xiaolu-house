#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { SUPPORTED_CITIES } from './areas.js'

const CONFIG_DIR = join(homedir(), '.xiaolu-house')
const CONFIG_FILE = join(CONFIG_DIR, 'config')

function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }
}

function encode(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

function decode(str) {
  try {
    return JSON.parse(Buffer.from(str, 'base64').toString('utf-8'))
  } catch {
    return {}
  }
}

function getConfig() {
  if (!existsSync(CONFIG_FILE)) return {}
  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8').trim()
    return decode(content)
  } catch {
    return {}
  }
}

function saveConfig(data) {
  ensureConfigDir()
  writeFileSync(CONFIG_FILE, encode(data), 'utf-8')
}

// 显示当前配置
export function cmdConfigShow() {
  const cfg = getConfig()
  console.log()
  if (cfg.apiKey) {
    const masked = cfg.apiKey.replace(/(.{6}).{8}(.*)/, '$1********$2')
    console.log(`  API Key: ${masked}`)
  } else {
    console.log('  API Key: (未设置)')
  }

  if (cfg.city) {
    console.log(`  默认城市: ${cfg.city}`)
  } else {
    console.log('  默认城市: (未设置)')
  }

  console.log()
  console.log(`  配置文件: ${CONFIG_FILE}`)
  console.log()
}

// 设置 API Key
export function cmdConfigSetKey(key) {
  const cfg = getConfig()
  cfg.apiKey = key
  saveConfig(cfg)
  const masked = key.replace(/(.{6}).{8}(.*)/, '$1********$2')
  console.log()
  console.log('[OK] API Key 已保存')
  console.log(`    ${masked}`)
  console.log()
}

// 设置城市
export function cmdConfigSetCity(city) {
  const cities = SUPPORTED_CITIES
  const names = cities.map(c => c.city)

  // 检查城市是否在支持列表中
  if (!names.includes(city)) {
    console.error(`[ERROR] 不支持的城市: ${city}`)
    console.log()
    console.log('当前支持的城市:')
    names.forEach(name => console.log(`  - ${name}`))
    process.exit(1)
  }

  const cfg = getConfig()
  cfg.city = city
  saveConfig(cfg)
  console.log()
  console.log(`[OK] 城市已保存: ${city}`)
  console.log()
}

// 清除所有配置
export function cmdConfigClear() {
  ensureConfigDir()
  writeFileSync(CONFIG_FILE, '', 'utf-8')
  console.log()
  console.log('[OK] 配置已清除')
  console.log()
}
