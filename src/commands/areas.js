#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const CONFIG_FILE = join(homedir(), '.xiaolu-house', 'config')

// ── 静态数据 ─────────────────────────────────────────────────────────

export const SUPPORTED_CITIES = [
  {
    city: '深圳',
    cityCode: '440300',
    areas: [
      {
        name: '南山',
        areaId: '440305',
        items: [
          { subAreaId: '440305', name: '不限' },
          { subAreaId: '440305|蛇口', name: '蛇口' },
          { subAreaId: '440305|前海', name: '前海' },
          { subAreaId: '440305|科技园', name: '科技园' },
          { subAreaId: '440305|华侨城', name: '华侨城' },
          { subAreaId: '440305|后海', name: '后海' },
          { subAreaId: '440305|深圳湾', name: '深圳湾' },
          { subAreaId: '440305|南山中心', name: '南山中心' },
          { subAreaId: '440305|红树湾', name: '红树湾' },
          { subAreaId: '440305|南头', name: '南头' },
          { subAreaId: '440305|大学城', name: '大学城' },
          { subAreaId: '440305|西丽', name: '西丽' },
          { subAreaId: '440305|白石洲', name: '白石洲' },
        ],
      },
      {
        name: '宝安',
        areaId: '440306',
        items: [
          { subAreaId: '440306', name: '不限' },
          { subAreaId: '440306|西乡', name: '西乡' },
          { subAreaId: '440306|宝安中心', name: '宝安中心' },
          { subAreaId: '440306|碧海', name: '碧海' },
          { subAreaId: '440306|新安', name: '新安' },
          { subAreaId: '440306|翻身', name: '翻身' },
          { subAreaId: '440306|曦城', name: '曦城' },
          { subAreaId: '440306|航城', name: '航城' },
          { subAreaId: '440306|桃源居', name: '桃源居' },
          { subAreaId: '440306|福永', name: '福永' },
          { subAreaId: '440306|沙井', name: '沙井' },
          { subAreaId: '440306|石岩', name: '石岩' },
          { subAreaId: '440306|松岗', name: '松岗' },
        ],
      },
      {
        name: '龙华',
        areaId: '_440311',
        items: [
          { subAreaId: '_440311', name: '不限' },
          { subAreaId: '_440311|红山', name: '红山' },
          { subAreaId: '_440311|龙华中心', name: '龙华中心' },
          { subAreaId: '_440311|民治', name: '民治' },
          { subAreaId: '_440311|上塘', name: '上塘' },
          { subAreaId: '_440311|龙华新区', name: '龙华新区' },
          { subAreaId: '_440311|观澜', name: '观澜' },
        ],
      },
      {
        name: '福田',
        areaId: '440304',
        items: [
          { subAreaId: '440304', name: '不限' },
          { subAreaId: '440304|香蜜湖', name: '香蜜湖' },
          { subAreaId: '440304|安托山', name: '安托山' },
          { subAreaId: '440304|竹子林', name: '竹子林' },
          { subAreaId: '440304|百花', name: '百花' },
          { subAreaId: '440304|黄木岗', name: '黄木岗' },
          { subAreaId: '440304|景田', name: '景田' },
          { subAreaId: '440304|梅林', name: '梅林' },
          { subAreaId: '440304|华强北', name: '华强北' },
          { subAreaId: '440304|皇岗', name: '皇岗' },
          { subAreaId: '440304|上下沙', name: '上下沙' },
          { subAreaId: '440304|石厦', name: '石厦' },
          { subAreaId: '440304|新洲', name: '新洲' },
          { subAreaId: '440304|莲花', name: '莲花' },
          { subAreaId: '440304|福田中心', name: '福田中心' },
          { subAreaId: '440304|香梅北', name: '香梅北' },
          { subAreaId: '440304|车公庙', name: '车公庙' },
          { subAreaId: '440304|园岭', name: '园岭' },
          { subAreaId: '440304|赤尾', name: '赤尾' },
          { subAreaId: '440304|沙尾', name: '沙尾' },
          { subAreaId: '440304|华强南', name: '华强南' },
        ],
      },
      {
        name: '罗湖',
        areaId: '440303',
        items: [
          { subAreaId: '440303', name: '不限' },
          { subAreaId: '440303|银湖', name: '银湖' },
          { subAreaId: '440303|布心', name: '布心' },
          { subAreaId: '440303|黄贝岭', name: '黄贝岭' },
          { subAreaId: '440303|螺岭', name: '螺岭' },
          { subAreaId: '440303|莲塘', name: '莲塘' },
          { subAreaId: '440303|百仕达', name: '百仕达' },
          { subAreaId: '440303|清水河', name: '清水河' },
          { subAreaId: '440303|春风路', name: '春风路' },
          { subAreaId: '440303|新秀', name: '新秀' },
          { subAreaId: '440303|地王', name: '地王' },
          { subAreaId: '440303|万象城', name: '万象城' },
        ],
      },
      {
        name: '龙岗',
        areaId: '440307',
        items: [
          { subAreaId: '440307', name: '不限' },
          { subAreaId: '440307|布吉关', name: '布吉关' },
          { subAreaId: '440307|龙岗中心城', name: '龙岗中心城' },
          { subAreaId: '440307|坂田', name: '坂田' },
          { subAreaId: '440307|龙岗双龙', name: '龙岗双龙' },
          { subAreaId: '440307|石芽岭', name: '石芽岭' },
          { subAreaId: '440307|横岗', name: '横岗' },
          { subAreaId: '440307|布吉街', name: '布吉街' },
          { subAreaId: '440307|布吉水径', name: '布吉水径' },
          { subAreaId: '440307|坪地', name: '坪地' },
        ],
      },
      {
        name: '光明新区',
        areaId: '_440312',
        items: [
          { subAreaId: '_440312', name: '不限' },
          { subAreaId: '_440312|公明', name: '公明' },
        ],
      },
      {
        name: '盐田',
        areaId: '440308',
        items: [
          { subAreaId: '440308', name: '不限' },
          { subAreaId: '440308|梅沙', name: '梅沙' },
        ],
      },
      {
        name: '大鹏新区',
        areaId: '_440310',
        items: [
          { subAreaId: '_440310', name: '不限' },
          { subAreaId: '_440310|大鹏半岛', name: '大鹏半岛' },
        ],
      },
    ],
  },
]

// ── 工具函数 ─────────────────────────────────────────────────────────

function decodeConfig(str) {
  try {
    return JSON.parse(Buffer.from(str.trim(), 'base64').toString('utf-8'))
  } catch {
    return {}
  }
}

function getLocalCity() {
  if (!existsSync(CONFIG_FILE)) return null
  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8').trim()
    const cfg = decodeConfig(content)
    return cfg.city || null
  } catch {
    return null
  }
}

// cities 命令：返回当前支持的城市列表（写死）
export function cmdCities() {
  const lines = []
  lines.push('## 当前支持的城市列表')
  lines.push('')
  SUPPORTED_CITIES.forEach(({ city, cityCode }) => {
    lines.push(`- ${city}`)
  })
  lines.push('')
  lines.push('使用 `xiaolu-house config --set-city <your-city>` 设置默认城市')
  console.log(lines.join('\n'))
}

// areas 命令：返回当前城市的区域列表（markdown 格式）
export function cmdAreas() {
  const city = getLocalCity()
  if (!city) {
    console.error('[ERROR] 城市未配置')
    console.error('请先设置: `xiaolu-house config --set-city <your-city>`')
    console.error('当前支持的城市: `xiaolu-house cities`')
    process.exit(1)
  }

  const cityData = SUPPORTED_CITIES.find(c => c.city === city)
  if (!cityData) {
    console.error(`[ERROR] 未找到城市 "${city}" 的区域数据`)
    console.error('使用 `xiaolu-house cities` 查看当前支持的城市')
    process.exit(1)
  }

  const lines = []
  lines.push(`## ${city}区域areaId映射表`)
  lines.push('')

  cityData.areas.forEach(area => {
    lines.push(`### ${area.name}`)
    lines.push('')
    if (area.items && area.items.length > 0) {
      area.items.forEach(sub => {
        lines.push(`- ${sub.name}：\`${sub.subAreaId}\``)
      })
    }
    lines.push('')
  })

  console.log(lines.join('\n'))
}
