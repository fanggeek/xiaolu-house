#!/usr/bin/env node

import { getCity, apiGetWithCache, printResult, handleError } from '../utils.js'

/**
 * 获取当前城市区域 areaId 映射表（Markdown）
 */
export async function cmdAreas() {
  try {
    const city = getCity()
    const result = await apiGetWithCache(
      `/mcp-api/areas?city=${encodeURIComponent(city)}`,
      `${city}:areas`,
    )
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
