#!/usr/bin/env node

import { apiGetOptionalKey, clearCache, clearConfig, getConfig, handleError, printResult, saveConfig } from '../utils.js'

// 清除所有配置
export function cmdConfigClear() {
  clearConfig()
  clearCache()
  console.log()
  console.log('[OK] 配置和缓存已清除')
  console.log()
}

// 显示当前配置
export async function cmdConfigShow() {
  const cfg = getConfig()
  try {
    const result = await apiGetOptionalKey(
      `/mcp-api/profile?city=${encodeURIComponent(cfg.city || '')}`,
    )
    printResult(result)
  } catch (err) {
    handleError(err)
  }
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
  const cfg = getConfig()
  cfg.city = city
  saveConfig(cfg)
  console.log()
  console.log(`[OK] 城市已保存: ${city}`)
  console.log()
}
