#!/usr/bin/env node

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const SKILLS_DIR = join(ROOT_DIR, 'skills')
const GENERATOR_DIR = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = join(GENERATOR_DIR, 'template.md')
const META_PATH = join(GENERATOR_DIR, 'city-meta.json')

const template = readFileSync(TEMPLATE_PATH, 'utf8')
const cities = readCities(META_PATH).toSorted(compareByPinyin)
const citySkills = buildCitySkills(cities)

rmSync(SKILLS_DIR, { recursive: true, force: true })
mkdirSync(SKILLS_DIR, { recursive: true })

writeSkill('xiaolu-house', {
  skillName: 'xiaolu-house',
  cityPhrase: '',
  supportedCitiesSection: renderSupportedCitiesSection(cities),
  defaultCity: '<your-city>',
})

for (const citySkill of citySkills) {
  writeSkill(citySkill.skillName, {
    skillName: citySkill.skillName,
    cityPhrase: `在${citySkill.city.city}`,
    supportedCitiesSection: '',
    defaultCity: citySkill.city.city,
  })
}

console.log(`Generated 1 main skill and ${citySkills.length} city skills.`)

function writeSkill(skillName, data) {
  const skillDir = join(SKILLS_DIR, skillName)
  mkdirSync(skillDir, { recursive: true })
  writeFileSync(join(skillDir, 'SKILL.md'), renderTemplate(template, data))
}

function renderTemplate(text, data) {
  return text
    .replaceAll('{{skillName}}', data.skillName)
    .replaceAll('{{cityPhrase}}', data.cityPhrase)
    .replaceAll('{{supportedCitiesSection}}', data.supportedCitiesSection)
    .replaceAll('{{defaultCity}}', data.defaultCity)
    .replace(/\n{3,}/g, '\n\n')
}

function renderSupportedCitiesSection(items) {
  const cityList = items.map((city) => `\`${city.city}\``).join('、')
  return `## 支持城市\n目前支持以下城市：${cityList}\n\n---\n\n`
}

function buildCitySkills(items) {
  const baseSlugs = items.flatMap((city) =>
    city.cityPinyin.map((baseSlug) => ({ city, baseSlug })),
  )
  const baseSlugCounts = new Map()

  for (const item of baseSlugs) {
    baseSlugCounts.set(item.baseSlug, (baseSlugCounts.get(item.baseSlug) || 0) + 1)
  }

  const skillNames = new Set()

  return baseSlugs.map(({ city, baseSlug }) => {
    const slug = baseSlugCounts.get(baseSlug) > 1 ? `${city.provincePinyin}-${baseSlug}` : baseSlug
    const skillName = `${slug}-house`

    if (skillNames.has(skillName)) {
      throw new Error(`城市 skill 名称冲突: ${skillName}`)
    }

    skillNames.add(skillName)
    return { city, skillName }
  })
}

function compareByPinyin(a, b) {
  return a.cityPinyin[0].localeCompare(b.cityPinyin[0]) || a.city.localeCompare(b.city)
}

function readCities(path) {
  const items = JSON.parse(readFileSync(path, 'utf8'))

  return items.map((city) => {
    if (!city.city || !city.province) {
      throw new Error('每个城市都必须包含 city 和 province')
    }

    if (!city.provincePinyin) {
      throw new Error(`${city.city} 必须包含 provincePinyin`)
    }

    if (Array.isArray(city.provincePinyin)) {
      throw new Error(`${city.city} 的 provincePinyin 有且只能有一个`)
    }

    if (!Array.isArray(city.cityPinyin) || city.cityPinyin.length === 0) {
      throw new Error(`${city.city} 必须包含非空 cityPinyin 数组`)
    }

    return {
      ...city,
      provincePinyin: normalizeSlug(city.provincePinyin, `${city.city} 的 provincePinyin`),
      cityPinyin: normalizePinyin(city),
    }
  })
}

function normalizePinyin(city) {
  const slugs = city.cityPinyin.map((item) => normalizeSlug(item, `${city.city} 的 cityPinyin`))

  return [...new Set(slugs)]
}

function normalizeSlug(value, label) {
  if (typeof value !== 'string') {
    throw new Error(`${label} 只能是字符串`)
  }

  const slug = value.trim().toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${label} 格式不合法: ${value}`)
  }

  return slug
}
