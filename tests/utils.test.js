import { describe, it, mock, beforeEach } from 'node:test'
import assert from 'node:assert'
import { cleanParams, getApiKey } from '../src/utils.js'

// ─── cleanParams ───────────────────────────────────────────────────────────────

describe('cleanParams', () => {
  it('移除 undefined / null / 空数组字段', () => {
    const input = {
      city: '深圳',
      keyword: undefined,
      type: null,
      tags: [],
      rooms: 3,
      areaIds: undefined,
    }
    const result = cleanParams(input)
    assert.deepStrictEqual(result, { city: '深圳', rooms: 3 })
  })

  it('保留 falsy 但有效的值（如 0）', () => {
    const result = cleanParams({ priceMin: 0, priceMax: 500, keyword: undefined })
    assert.deepStrictEqual(result, { priceMin: 0, priceMax: 500 })
  })

  it('空对象返回空对象', () => {
    assert.deepStrictEqual(cleanParams({}), {})
  })
})

// ─── getApiKey ─────────────────────────────────────────────────────────────────

describe('getApiKey', () => {
  // API Key 只从配置文件读取，测试需要模拟配置文件
})
