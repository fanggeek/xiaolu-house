import { createRequire } from 'module'
import { program } from 'commander'

// __dirname 在 CJS 运行时可用，import.meta.url 在 ESM 源码时可用
const _require = createRequire(import.meta.url || __filename)
const pkg = _require('../package.json')
import { cmdHouses } from './commands/houses.js'
import { cmdCommunities } from './commands/communities.js'
import { cmdDeals } from './commands/deals.js'
import { cmdSchools } from './commands/schools.js'
import { cmdNewCommunities } from './commands/new-communities.js'
import { cmdSuggestions } from './commands/suggestions.js'
import {cmdConfigShow, cmdConfigSetKey, cmdConfigSetCity, cmdConfigClear} from './commands/config.js'
import { cmdCities, cmdAreas } from './commands/areas.js'

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .showHelpAfterError()
  .showSuggestionAfterError()

// ── 配置管理 ──────────────────────────────────────────────────────
program
  .command('config')
  .description('配置管理')
  .option('--show', '查看当前配置')
  .option('--set-api-key <apiKey>', '设置 API Key')
  .option('--set-city <city>', '设置默认城市')
  .option('--clear', '清除所有配置')
  .action((opts) => {
    if (opts.show) {
      cmdConfigShow()
    } else if (opts.setApiKey) {
      cmdConfigSetKey(opts.setApiKey)
    } else if (opts.setCity) {
      cmdConfigSetCity(opts.setCity)
    } else if (opts.clear) {
      cmdConfigClear()
    }
  })

// ── 城市列表 ──────────────────────────────────────────────────────
program
  .command('cities')
  .description('查看当前支持的城市列表')
  .action(() => {
    cmdCities()
  })

// ── 区域列表 ──────────────────────────────────────────────────────
program
  .command('areas')
  .description('查看当前城市的区域数据')
  .action(() => {
    cmdAreas()
  })

// ── 搜索匹配相关的小区、学校、地铁站、新房 ──────────────────────────────────────────────────────
program
  .command('suggest <keyword>')
  .description('根据关键词，模糊搜索匹配相关的小区、学校、地铁站、新房，并返回各类型查询结果 ID')
  .option('-t, --type <type>', '交易类型: sell=售房, rent=租房', 'sell')
  .action((keyword, opts) => {
    cmdSuggestions({ keyword, ...opts })
  })

// ── 查询房源 ──────────────────────────────────────────────────────
program
  .command('houses')
  .description('查询二手房/租房房源列表')
  .option('-t, --type <type>', '类型: sell=售房, rent=租房', 'sell')
  .option('-a, --area-ids <areaIds>', 'areaId，格式: "440305|南山"，使用 `xiaolu-house areas` 查看（可多次使用）', collect, [])
  .option('-c, --community-name <communityName>', '小区名称关键字')
  .option('--community-ids <communityIds>', 'communityId 列表，逗号分隔', parseList)
  .option('-r, --rooms <rooms>', '室数，逗号分隔，如: 2,3', parseStringList)
  .option('--min-sell-price <price>', '最低售价（总价万元）', Number)
  .option('--max-sell-price <price>', '最高售价（总价万元）', Number)
  .option('--min-rent-price <price>', '最低月租（元）', Number)
  .option('--max-rent-price <price>', '最高月租（元）', Number)
  .option('--min-area <area>', '最小面积（㎡）', Number)
  .option('--max-area <area>', '最大面积（㎡）', Number)
  .option('--toilets <toilets>', '卫数，如: 1,2', parseStringList)
  .option('--elevator <mode>', '电梯: 1=无电梯, 2=有电梯, 3=电梯入户', parseIntList)
  .option('--direction <dir>', '朝向，如: 南,东南', parseList)
  // .option('-s, --sort <sort>', '排序方式: price_asc/price_desc/newest/oldest/area_desc...', 'default')
  .option('--subway-ids <subwayIds>', 'subwayId，可多次使用', collect, [])
  .option('--school-ids <schoolIds>', 'schoolId，可多次使用', collect, [])
  .action((opts) => {
    cmdHouses(opts)
  })

// ── 查询小区 ──────────────────────────────────────────────────────
program
  .command('communities')
  .description('查询小区列表')
  .option('-n, --community-name <name>', '小区名称关键字')
  .option('-a, --area-ids <areaIds>', 'areaId，格式: "440305|蛇口"，使用 `xiaolu-house areas` 查看')
  .option('-i, --community-ids <communityIds>', 'communityId 列表，逗号分隔', parseList)
  .action((opts) => {
    cmdCommunities(opts)
  })

// ── 查询成交记录 ──────────────────────────────────────────────────
program
  .command('deals')
  .description('查询二手房成交列表')
  .option('-a, --area-ids <areaIds>', 'areaId，格式: "440305|南山"，使用 `xiaolu-house areas` 查看', collect, [])
  .option('--sub-area <subArea>', '片区名称，如: 南山')
  .option('-c, --community-ids <communityIds>', 'communityId 列表，逗号分隔', parseList)
  .option('--school-ids <schoolIds>', 'schoolId 列表，逗号分隔', parseList)
  .action((opts) => {
    cmdDeals(opts)
  })

// ── 查询学校 ──────────────────────────────────────────────────────
program
  .command('schools')
  .description('查询学校列表')
  .option('--school-name <schoolName>', '学校名称关键字')
  .option('-t, --type <type>', '类型: pri=小学, mid=中学')
  .option('--nature <nature>', '性质: 1=公办, 2=私立', Number)
  .option('--tiers <tiers>', '梯队: 1,2,3...', parseIntList)
  .option('-a, --area-ids <areaIds>', 'areaId 列表，逗号分隔', parseList)
  .option('-i, --school-ids <schoolIds>', 'schoolId 列表，逗号分隔', parseList)
  .action((opts) => {
    cmdSchools(opts)
  })

// ── 查询新房 ──────────────────────────────────────────────────────
program
  .command('new-communities')
  .description('查询新房列表')
  .option('--new-community-name <newCommunityName>', '新房名称关键字')
  .option('-a, --area-ids <areaIds>', 'areaId，格式: "440305|前海"，使用 xiaolu-house areas 查看')
  .option('-r, --rooms <rooms>', '室数，逗号分隔', parseList)
  .option('-p, --property-types <types>', '物业类型: 1=住宅,2=商铺...', parseList)
  .option('--status <status>', '状态: hot=热门, onsell=在售, wait=待售')
  .option('--min-price <price>', '最低价格（万元）', Number)
  .option('--max-price <price>', '最高价格（万元）', Number)
  .option('--price-type <type>', '价格类型: totalPrice=总价, averagePrice=均价', 'totalPrice')
  .option('--decoration <types>', '装修: 1=精装,2=简装,3=毛坯', parseIntList)
  .option('--construction-areas <areas>', '建筑面积区间，格式: min,max', parseConstructionAreas)
  .option('-i, --new-community-ids <newCommunityIds>', 'newCommunityId 列表，逗号分隔', parseList)
  .action((opts) => {
    cmdNewCommunities(opts)
  })

// 默认行为：无子命令时显示所有命令帮助
program.action(() => {
  console.log(program.helpInformation())
  program.commands.forEach(cmd => {
    console.log(`\n## ${cmd.name()}\n`)
    console.log(cmd.helpInformation())
    console.log()
  })
  // 一并输出城市区域映射表
  cmdAreas()
})

// --help 时显示所有子命令帮助
program.on('--help', () => {
  program.commands.forEach(cmd => {
    console.log(`## ${cmd.name()}`)
    console.log(cmd.helpInformation())
    console.log()
  })
  // 一并输出城市区域映射表
  cmdAreas()
})

program.parse()

// ── 工具函数 ──────────────────────────────────────────────────────
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
