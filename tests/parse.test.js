import { describe, it } from 'node:test'
import assert from 'node:assert'

// ─── 工具函数（从 index.js 复制，确保与 CLI 解析一致） ──────────────────────────

function collect(val, prev) {
  return prev.concat([val])
}

function parseList(val) {
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

function parseIntList(val) {
  return val.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
}

function parseStringList(val) {
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

function parseConstructionAreas(val) {
  const parts = val.split(',').map(s => s.trim())
  if (parts.length !== 2) return undefined
  const rawMin = parts[0] === '' ? undefined : Number(parts[0])
  const rawMax = parts[1] === '' ? undefined : Number(parts[1])
  const minValid = !Number.isNaN(rawMin)
  const maxValid = !Number.isNaN(rawMax)
  if (!minValid && !maxValid) return undefined
  return { min: minValid ? rawMin : undefined, max: maxValid ? rawMax : undefined }
}

// ─── parseList ─────────────────────────────────────────────────────────────────

describe('parseList - 逗号分隔字符串转数组', () => {
  it('单值', () => {
    assert.deepStrictEqual(parseList('南山区'), ['南山区'])
  })

  it('多值去空格', () => {
    assert.deepStrictEqual(parseList('南山,福田,罗湖'), ['南山', '福田', '罗湖'])
  })

  it('多值带空格', () => {
    assert.deepStrictEqual(parseList('南山 , 福田 , 罗湖'), ['南山', '福田', '罗湖'])
  })

  it('空字符串返回空数组', () => {
    assert.deepStrictEqual(parseList(''), [])
  })

  it('只含逗号返回空数组', () => {
    assert.deepStrictEqual(parseList(',,'), [])
  })
})

// ─── parseIntList ──────────────────────────────────────────────────────────────

describe('parseIntList - 逗号分隔转数字数组', () => {
  it('单值', () => {
    assert.deepStrictEqual(parseIntList('1'), [1])
  })

  it('多值', () => {
    assert.deepStrictEqual(parseIntList('1,2,3'), [1, 2, 3])
  })

  it('带空格', () => {
    assert.deepStrictEqual(parseIntList('1 , 2 , 3'), [1, 2, 3])
  })

  it('过滤非数字', () => {
    assert.deepStrictEqual(parseIntList('1,abc,3'), [1, 3])
  })

  it('空字符串返回空数组', () => {
    assert.deepStrictEqual(parseIntList(''), [])
  })
})

// ─── parseStringList ───────────────────────────────────────────────────────────

describe('parseStringList - 逗号分隔字符串数组', () => {
  it('正常多值', () => {
    assert.deepStrictEqual(parseStringList('2,3'), ['2', '3'])
  })

  it('去空格', () => {
    assert.deepStrictEqual(parseStringList('2 , 3'), ['2', '3'])
  })

  it('空值', () => {
    assert.deepStrictEqual(parseStringList(''), [])
  })
})

// ─── parseConstructionAreas ────────────────────────────────────────────────────

describe('parseConstructionAreas - 面积区间解析', () => {
  it('完整区间', () => {
    assert.deepStrictEqual(parseConstructionAreas('70,120'), { min: 70, max: 120 })
  })

  it('只有最小值', () => {
    assert.deepStrictEqual(parseConstructionAreas('70,'), { min: 70, max: undefined })
  })

  it('只有最大值', () => {
    assert.deepStrictEqual(parseConstructionAreas(',120'), { min: undefined, max: 120 })
  })

  it('带空格', () => {
    assert.deepStrictEqual(parseConstructionAreas(' 70 , 120 '), { min: 70, max: 120 })
  })

  it('非数字返回 undefined', () => {
    assert.strictEqual(parseConstructionAreas('abc,def'), undefined)
  })

  it('单个值返回 undefined', () => {
    assert.strictEqual(parseConstructionAreas('70'), undefined)
  })

  it('三个值返回 undefined', () => {
    assert.strictEqual(parseConstructionAreas('70,120,200'), undefined)
  })
})

// ─── collect - 多值选项累积 ─────────────────────────────────────────────────

describe('collect - 多值选项累积', () => {
  it('累积多值', () => {
    assert.deepStrictEqual(collect('南山', []), ['南山'])
    assert.deepStrictEqual(collect('福田', ['南山']), ['南山', '福田'])
  })
})
