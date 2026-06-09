import { program } from 'commander'
import pkg from '../package.json' with { type: 'json' }

import { cmdHouses } from './commands/houses.js'
import { cmdCommunities } from './commands/communities.js'
import { cmdDeals } from './commands/deals.js'
import { cmdSchools } from './commands/schools.js'
import { cmdNewCommunities } from './commands/new-communities.js'
import {
  cmdConfigShow,
  cmdConfigSetKey,
  cmdConfigSetCity,
  cmdConfigClear,
} from './commands/config.js'
import { cmdCities } from './commands/cities.js'
import { cmdAreas } from './commands/areas.js'

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
  .option('--show', '查看当前配置及用户信息')
  .option('--set-api-key <apiKey>', '设置 API Key')
  .option('--set-city <city>', '设置默认城市')
  .option('--clear', '清除所有配置')
  .action(async (opts) => {
    if (opts.setApiKey) {
      cmdConfigSetKey(opts.setApiKey)
    } else if (opts.setCity) {
      await cmdConfigSetCity(opts.setCity)
    } else if (opts.clear) {
      cmdConfigClear()
    } else {
      await cmdConfigShow()
    }
  })

// ── 城市列表 ──────────────────────────────────────────────────────
program
  .command('cities')
  .description('查看当前支持的城市列表')
  .action(async () => {
    await cmdCities()
  })

// ── 区域列表 ──────────────────────────────────────────────────────
program
  .command('areas')
  .description('查看当前城市的区域 areaId 映射表')
  .action(async () => {
    await cmdAreas()
  })

// ── 查询房源 ──────────────────────────────────────────────────────
// prettier-ignore
program
  .command('houses')
  .description('查询二手房/租房房源列表')
  .option('--type <type>', '需求类型：sell=售、rent=租', 'sell')
  .option('--name <name>', '小区或学校或地铁站的名称，如"澳城花园"、"百花小学"、"翻身站"')
  .requiredOption('--reason <reason>', '调用这个命令的理由')
  .option('--rooms <rooms>', '室数：1=1室、2=2室、3=3室、4=4室、5=4室以上，多个逗号分隔，如：2,3', parseIntList)
  .option('--min-sell-price <price>', '最低售价（总价万元）', Number)
  .option('--max-sell-price <price>', '最高售价（总价万元）', Number)
  .option('--min-rent-price <price>', '最低月租（元）', Number)
  .option('--max-rent-price <price>', '最高月租（元）', Number)
  .option('--min-area <area>', '最小面积（㎡）', Number)
  .option('--max-area <area>', '最大面积（㎡）', Number)
  .option('--toilets <toilets>', '卫数：1=1卫、2=2卫、3=3卫、4=4卫、5=4卫以上，多个逗号分隔，如：1,2', parseIntList)
  .option('--elevator <mode>', '电梯情况：1=无电梯、2=有电梯、3=电梯入户', parseIntList)
  .option('--direction <dir>', '朝向：东、南、西、北、东南、东北、西南、西北', parseList)
  .option('--area-ids <areaIds>', '区域 ID 数组，多个逗号分隔，如："440305|前海,440306|翻身"', parseList)
  .action((opts) => {
    cmdHouses(opts)
  })

// ── 查询小区 ──────────────────────────────────────────────────────
// prettier-ignore
program
  .command('communities')
  .description('查询小区列表')
  .option('--name <name>', '小区名称，如"澳城花园"')
  .requiredOption('--reason <reason>', '调用这个命令的理由')
  .option('--area-id <areaId>', '区域ID，如："440305|前海"')
  .action((opts) => {
    cmdCommunities(opts)
  })

// ── 查询成交记录 ──────────────────────────────────────────────────
// prettier-ignore
program
  .command('deals')
  .description('查询二手房成交列表')
  .option('--name <name>', '小区或学校的名称，如"澳城花园"、"百花小学"')
  .requiredOption('--reason <reason>', '调用这个命令的理由')
  .option('--area-id <areaId>', '区域ID，如："440305|前海"')
  .action((opts) => {
    cmdDeals(opts)
  })

// ── 查询学校 ──────────────────────────────────────────────────────
// prettier-ignore
program
  .command('schools')
  .description('查询学校列表')
  .option('--name <name>', '学校名称，如"百花小学"')
  .requiredOption('--reason <reason>', '调用这个命令的理由')
  .option('--type <type>', '学校类型：pri=小学、mid=中学')
  .option('--nature <nature>', '学校性质：1=公办、2=私立', Number)
  .option('--tiers <tiers>', '梯队：1=第一梯队、2=第二梯队、3=第三梯队、4=第四梯队、999=无梯队，多个逗号分隔，如：1,2', parseIntList)
  .option('--area-ids <areaIds>', '区域 ID 数组，多个逗号分隔，如："440305|前海,440306|翻身"', parseList)
  .action((opts) => {
    cmdSchools(opts)
  })

// ── 查询新房 ──────────────────────────────────────────────────────
// prettier-ignore
program
  .command('new-communities')
  .description('查询新房列表')
  .option('--name <name>', '新房名称，如"开云府"')
  .requiredOption('--reason <reason>', '调用这个命令的理由')
  .option('--rooms <rooms>', '室数：1=1室、2=2室、3=3室、4=4室、5=4室以上，多个逗号分隔，如：2,3', parseIntList)
  .option('--property-types <types>', '物业类型：1=住宅、2=商铺、3=写字楼', parseIntList)
  .option('--sell-status <sellStatus>', '销售状态：hot=热门、onsell=在售、wait=待售')
  .option('--min-price <price>', '最低价格（万元）', Number)
  .option('--max-price <price>', '最高价格（万元）', Number)
  .option('--price-type <type>', '价格类型：totalPrice=总价、averagePrice=均价', 'totalPrice')
  .option('--decoration <types>', '装修类型：1=精装、2=简装、3=毛坯', parseIntList)
  .option('--min-construction-area <area>', '最小建筑面积（㎡）', Number)
  .option('--max-construction-area <area>', '最大建筑面积（㎡）', Number)
  .option('--area-id <areaId>', '区域ID，如："440306|翻身"')
  .action((opts) => {
    cmdNewCommunities(opts)
  })

// 默认行为：无子命令时显示所有命令帮助
program.action(async () => {
  await showFullHelp()
})

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

// ── 工具函数 ──────────────────────────────────────────────────────
function collect(val, prev) {
  return prev.concat([val])
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


async function showFullHelp() {
  console.log(program.helpInformation())
  console.log()
  program.commands.forEach((cmd) => {
    console.log(`\n## ${cmd.name()}\n`)
    console.log(cmd.helpInformation())
    console.log()
  })

  await cmdAreas()
}

async function main() {
  if (shouldShowRootHelp(process.argv.slice(2))) {
    await showFullHelp()
  } else {
    await program.parseAsync()
  }
}

function shouldShowRootHelp(argv) {
  const hasHelpFlag = argv.includes('--help') || argv.includes('-h')
  if (!hasHelpFlag) return false

  const firstNonOptionArg = argv.find((arg) => !arg.startsWith('-'))
  if (!firstNonOptionArg) return true

  return !program.commands.some((cmd) => cmd.name() === firstNonOptionArg)
}
