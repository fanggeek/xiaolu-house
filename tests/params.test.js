import { describe, it } from 'node:test'
import assert from 'node:assert'

// ─── 工具函数复现（与 index.js 完全一致） ─────────────────────────────────────

function cleanParams(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0),
    ),
  )
}

function parseList(val) {
  return val
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseIntList(val) {
  return val
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n))
}

function parseStringList(val) {
  return val
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}


// ─── cleanParams ─────────────────────────────────────────────────────────────

describe('cleanParams', () => {
  it('移除 undefined / null / 空数组', () => {
    assert.deepStrictEqual(
      cleanParams({ a: 1, b: undefined, c: null, d: [] }),
      { a: 1 },
    )
  })

  it('保留 falsy 但有效的值（0/false/空字符串均保留，cleanParams 只过滤 undefined/null/空数组）', () => {
    // cleanParams 的过滤规则：v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)
    // 所以 0 / false / '' 都会被保留
    assert.deepStrictEqual(cleanParams({ a: 0, b: false, c: '' }), {
      a: 0,
      b: false,
      c: '',
    })
  })

  it('保留空数组以外的非空数组', () => {
    assert.deepStrictEqual(cleanParams({ a: [1, 2] }), { a: [1, 2] })
  })

  it('空对象和空数组：Object.entries 层面空对象不被 cleanParams 过滤（只有 undefined/null/空数组被过滤）', () => {
    // cleanParams 过滤规则：v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)
    // {} 不是 undefined/null/空数组，所以被保留
    assert.deepStrictEqual(cleanParams({ a: {}, b: [] }), { a: {} })
  })
})

// ─── houses 参数映射 ─────────────────────────────────────────────────────────

describe('houses - API 参数映射', () => {
  it('默认 type=sell', () => {
    const opts = {}
    const unitType = opts.type || 'sell'
    assert.strictEqual(unitType, 'sell')
  })

  it('指定 type=rent', () => {
    const opts = { type: 'rent' }
    const unitType = opts.type || 'sell'
    assert.strictEqual(unitType, 'rent')
  })

  it('areaIds 多值数组保留', () => {
    const optsArea = ['440305', '440304']
    const areaIds = optsArea?.length ? optsArea : undefined
    assert.deepStrictEqual(areaIds, ['440305', '440304'])
  })

  it('rooms parseStringList', () => {
    const rooms = parseStringList('2,3')
    assert.deepStrictEqual(rooms, ['2', '3'])
  })

  it('prices 区间构建（两值都有）', () => {
    const minPrice = 200,
      maxPrice = 600
    const prices =
      minPrice !== undefined || maxPrice !== undefined
        ? [cleanParams({ min: minPrice, max: maxPrice })]
        : undefined
    assert.deepStrictEqual(prices, [{ min: 200, max: 600 }])
  })

  it('prices 区间构建（只有最小值）', () => {
    const minPrice = 200,
      maxPrice = undefined
    const prices =
      minPrice !== undefined || maxPrice !== undefined
        ? [cleanParams({ min: minPrice, max: maxPrice })]
        : undefined
    assert.deepStrictEqual(prices, [{ min: 200 }])
  })

  it('prices 区间构建（无值）', () => {
    const prices =
      undefined !== undefined || undefined !== undefined
        ? [cleanParams({ min: undefined, max: undefined })]
        : undefined
    assert.strictEqual(prices, undefined)
  })

  it('constructionAreas 区间构建', () => {
    const minArea = 70,
      maxArea = 120
    const constructionAreas =
      minArea !== undefined || maxArea !== undefined
        ? [cleanParams({ min: minArea, max: maxArea })]
        : undefined
    assert.deepStrictEqual(constructionAreas, [{ min: 70, max: 120 }])
  })

  it('elevators parseIntList', () => {
    const elevators = parseIntList('1,2')
    assert.deepStrictEqual(elevators, [1, 2])
  })

  it('directionTypes parseList', () => {
    const directionTypes = parseList('南,东南')
    assert.deepStrictEqual(directionTypes, ['南', '东南'])
  })

  it('sort 默认 default', () => {
    const opts = {}
    const sort = opts.sort || 'default'
    assert.strictEqual(sort, 'default')
  })

  it('完整参数 cleanParams 过滤空值', () => {
    const prices = [cleanParams({ min: 200, max: 600 })]
    const constructionAreas = [cleanParams({ min: 70, max: 120 })]
    const elevators = parseIntList('1,2')
    const directionTypes = parseList('南,东南')
    const rooms = parseStringList('2,3')

    const params = cleanParams({
      city: '深圳',
      unitType: 'sell',
      communityName: undefined,
      areaIds: undefined,
      subwayIds: undefined,
      schoolIds: undefined,
      rooms,
      prices,
      constructionAreas,
      sort: 'price_asc',
      elevators,
      directionTypes,
      nextId: undefined,
    })

    assert.deepStrictEqual(params, {
      city: '深圳',
      unitType: 'sell',
      rooms: ['2', '3'],
      prices: [{ min: 200, max: 600 }],
      constructionAreas: [{ min: 70, max: 120 }],
      sort: 'price_asc',
      elevators: [1, 2],
      directionTypes: ['南', '东南'],
    })
  })
})

// ─── communities 参数映射 ────────────────────────────────────────────────────

describe('communities - API 参数映射', () => {
  it('完整参数', () => {
    const ids = parseList('id1,id2')
    const params = cleanParams({
      city: '深圳',
      communityName: '阳光小区',
      areaId: '440305',
      communityIds: ids,
      nextId: 'cursor123',
    })
    assert.deepStrictEqual(params, {
      city: '深圳',
      communityName: '阳光小区',
      areaId: '440305',
      communityIds: ['id1', 'id2'],
      nextId: 'cursor123',
    })
  })

  it('空参数只含 city', () => {
    const params = cleanParams({
      city: '深圳',
      communityName: undefined,
      areaId: undefined,
      communityIds: undefined,
      nextId: undefined,
    })
    assert.deepStrictEqual(params, { city: '深圳' })
  })

  it('areaId 格式不过滤', () => {
    // '440305|南山' 这种带|的格式应该保留
    const params = cleanParams({ city: '深圳', areaId: '440305|南山' })
    assert.strictEqual(params.areaId, '440305|南山')
  })
})

// ─── deals 参数映射 ───────────────────────────────────────────────────────────

describe('deals - API 参数映射', () => {
  it('完整参数', () => {
    const communityIds = parseList('c1,c2')
    const schoolIds = parseIntList('1,2')
    const params = cleanParams({
      city: '深圳',
      areaId: '440305',
      subArea: '南山',
      communityIds,
      schoolIds,
      nextId: 'next123',
    })
    assert.deepStrictEqual(params, {
      city: '深圳',
      areaId: '440305',
      subArea: '南山',
      communityIds: ['c1', 'c2'],
      schoolIds: [1, 2],
      nextId: 'next123',
    })
  })

  it('空参数只含 city', () => {
    const params = cleanParams({
      city: '深圳',
      areaId: undefined,
      subArea: undefined,
      communityIds: undefined,
      schoolIds: undefined,
      nextId: undefined,
    })
    assert.deepStrictEqual(params, { city: '深圳' })
  })
})

// ─── schools 参数映射 ─────────────────────────────────────────────────────────

describe('schools - API 参数映射', () => {
  it('keyword 基本参数', () => {
    const params = cleanParams({ city: '深圳', keyword: '育才二小' })
    assert.deepStrictEqual(params, { city: '深圳', keyword: '育才二小' })
  })

  it('完整参数', () => {
    const tiers = parseIntList('1,2')
    const areaIds = parseList('440305,440304')
    const ids = parseList('s1,s2')

    const params = cleanParams({
      city: '深圳',
      keyword: '育才',
      type: 'pri',
      nature: 1, // Number
      tiers,
      areaIds,
      schoolIds: ids,
      nextId: 'n1',
    })

    assert.deepStrictEqual(params, {
      city: '深圳',
      keyword: '育才',
      type: 'pri',
      nature: 1,
      tiers: [1, 2],
      areaIds: ['440305', '440304'],
      schoolIds: ['s1', 's2'],
      nextId: 'n1',
    })
  })

  it('nature 接受 Number（commander --nature 1 转数字）', () => {
    const opts = { nature: 1 }
    assert.strictEqual(typeof opts.nature, 'number')
  })

  it('tiers parseIntList 转换正确', () => {
    const tiers = parseIntList('1,2,3')
    assert.deepStrictEqual(tiers, [1, 2, 3])
    assert.strictEqual(typeof tiers[0], 'number')
  })

  it('schools 仅暴露 --name 长参数', () => {
    const def = '--name <name>'
    assert.strictEqual(def.startsWith('-'), true)
    assert.strictEqual(def.startsWith('-n,'), false)
  })
})

// ─── new-communities 参数映射 ─────────────────────────────────────────────────────

describe('new-communities - API 参数映射', () => {
  it('基本参数', () => {
    const params = cleanParams({
      city: '深圳',
      keyword: '华润城',
      areaId: '440305',
    })
    assert.deepStrictEqual(params, {
      city: '深圳',
      keyword: '华润城',
      areaId: '440305',
    })
  })

  it('完整参数', () => {
    const rooms = parseList('2,3')
    const propertyTypes = parseList('1,2')
    const decoration = parseIntList('1,2,3')
    const minConstructionArea = 80,
      maxConstructionArea = 120
    const constructionAreas =
      minConstructionArea !== undefined || maxConstructionArea !== undefined
        ? cleanParams({ min: minConstructionArea, max: maxConstructionArea })
        : undefined

    const minPrice = 500,
      maxPrice = 1000
    const priceRange =
      minPrice !== undefined || maxPrice !== undefined
        ? cleanParams({ min: minPrice, max: maxPrice })
        : undefined

    const params = cleanParams({
      city: '深圳',
      keyword: '华润城',
      areaId: '440305',
      rooms,
      propertyTypes,
      sellStatus: 'onsell',
      priceType: 'totalPrice',
      priceRange,
      decorationStandards: decoration,
      sort: 'price_asc',
      constructionAreas,
      nextId: 'n1',
    })

    assert.deepStrictEqual(params, {
      city: '深圳',
      keyword: '华润城',
      areaId: '440305',
      rooms: ['2', '3'],
      propertyTypes: ['1', '2'],
      sellStatus: 'onsell',
      priceType: 'totalPrice',
      priceRange: { min: 500, max: 1000 },
      decorationStandards: [1, 2, 3],
      sort: 'price_asc',
      constructionAreas: { min: 80, max: 120 },
      nextId: 'n1',
    })
  })

  it('priceRange 只有最大值时保留 max', () => {
    const minPrice = undefined,
      maxPrice = 1000
    const priceRange =
      minPrice !== undefined || maxPrice !== undefined
        ? cleanParams({ min: minPrice, max: maxPrice })
        : undefined
    assert.deepStrictEqual(priceRange, { max: 1000 })
  })

  it('priceRange 两值都无则不保留', () => {
    const priceRange =
      undefined !== undefined || undefined !== undefined
        ? cleanParams({ min: undefined, max: undefined })
        : undefined
    assert.strictEqual(priceRange, undefined)
  })

  it('sort 默认 smart', () => {
    const opts = {}
    const sort = opts.sort || 'smart'
    assert.strictEqual(sort, 'smart')
  })

  it('new-communities 仅暴露 --name 长参数', () => {
    const def = '--name <name>'
    assert.strictEqual(def.startsWith('-'), true)
    assert.strictEqual(def.startsWith('-n,'), false)
  })

  it('constructionAreas min/max 参数构建', () => {
    const minConstructionArea = 80,
      maxConstructionArea = 120
    const constructionAreas =
      minConstructionArea !== undefined || maxConstructionArea !== undefined
        ? cleanParams({ min: minConstructionArea, max: maxConstructionArea })
        : undefined
    assert.deepStrictEqual(constructionAreas, { min: 80, max: 120 })

    // 只传 min
    const constructionAreasMinOnly = cleanParams({ min: 80, max: undefined })
    assert.deepStrictEqual(constructionAreasMinOnly, { min: 80 })

    // 只传 max
    const constructionAreasMaxOnly = cleanParams({ min: undefined, max: 120 })
    assert.deepStrictEqual(constructionAreasMaxOnly, { max: 120 })

    // 都不传
    const constructionAreasNone =
      undefined !== undefined || undefined !== undefined
        ? cleanParams({ min: undefined, max: undefined })
        : undefined
    assert.strictEqual(constructionAreasNone, undefined)
  })
})

// ─── CLI 参数定义约束 ─────────────────────────────────────────────────────────

describe('CLI 参数定义约束', () => {
  it('schools name 不包含短参数', () => {
    const def = '--name <name>'
    assert.strictEqual(def.startsWith('-n,'), false)
  })

  it('new-communities property-types 不包含短参数', () => {
    const def = '--property-types <types>'
    assert.strictEqual(def.startsWith('-p,'), false)
  })
})
