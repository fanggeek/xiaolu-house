#!/usr/bin/env node

import { apiGetWithCache, printResult, handleError } from '../utils.js'

/**
 * 获取城市列表（从 API）
 */
export async function cmdCities() {
  try {
    const result = await apiGetWithCache('/mcp-api/cities', 'cities')
    printResult(result)
  } catch (err) {
    handleError(err)
  }
}
