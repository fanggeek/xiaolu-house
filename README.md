# xiaolu-house

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/xiaolu-house.svg)](https://www.npmjs.com/package/xiaolu-house)

小鹿选房命令行工具 — 让人类和 AI Agent 都能在终端中操作小鹿选房。

---

## SKILLS

| Skill          | Description                                              |
| -------------- | -------------------------------------------------------- |
| `xiaolu-house` | 当用户要查二手房、最新成交、小区、学校、新房、租房时使用 |

### SKILL 仓库
- [SkillHub](https://skillhub.cn/skills/xiaolu-house)
- [Skills.sh](https://skills.sh/fanggeek/xiaolu-house/xiaolu-house)
- [ClawHub](https://clawhub.ai/fangjike/xiaolu-house)
- [FindSkill](https://findskill.com/clawhub/fangjike/xiaolu-house)
- [ModelScope](https://modelscope.cn/skills)
- [Skillsmp](https://skillsmp.com/zh)

---

## CLI

### 安装

```bash
npx -y xiaolu-house
```

---

### 配置

```bash
# 查看当前支持的城市列表
npx -y xiaolu-house cities

# 设置 API Key（访问 https://www.xiaoluxuanfang.com/claw 根据页面内容操作）
npx -y xiaolu-house config --set-api-key <your-api-key>

# 设置默认城市
npx -y xiaolu-house config --set-city <your-city>

# 查看当前配置及用户信息
npx -y xiaolu-house config --show
```

配置文件：`~/.xiaolu-house/config`

---

### 命令列表

#### `config` — 配置管理

```bash
xiaolu-house config --show  # 查看当前配置及用户信息
xiaolu-house config --set-api-key <key>  # 设置 API Key
xiaolu-house config --set-city <your-city>  # 设置默认城市
xiaolu-house config --clear  # 清除所有配置
```

#### `cities` — 查看当前支持的城市列表

```bash
xiaolu-house cities
```

#### `areas` — 查看当前城市的区域 areaId 映射表

```bash
xiaolu-house areas
```

> 需先通过 `config --set-city` 设置默认城市。输出可用于 `--area-id` / `--area-ids` 参数。

#### `houses` — 查询二手房/租房房源列表

```bash
xiaolu-house houses
```

| 参数               | 说明                                                                         | 必填 | 默认值 |
| ------------------ | ---------------------------------------------------------------------------- | :--: | ------ |
| `--type`           | 需求类型：`sell`=售、`rent`=租                                               |  是  | `sell` |
| `--name`           | 小区或学校或地铁站的名称，如`澳城花园`、`百花小学`、`翻身站`                 |  否  | —      |
| `--reason`         | 调用这个命令的理由                                                           |  是  | —      |
| `--rooms`          | 室数：`1`=1室、`2`=2室、`3`=3室、`4`=4室、`5`=4室以上，多个逗号分隔，如`2,3` |  否  | —      |
| `--toilets`        | 卫数：`1`=1卫、`2`=2卫、`3`=3卫、`4`=4卫、`5`=4卫以上，多个逗号分隔，如`1,2` |  否  | —      |
| `--min-sell-price` | 最低售价（总价万元）                                                         |  否  | —      |
| `--max-sell-price` | 最高售价（总价万元）                                                         |  否  | —      |
| `--min-rent-price` | 最低月租（元）                                                               |  否  | —      |
| `--max-rent-price` | 最高月租（元）                                                               |  否  | —      |
| `--min-area`       | 最小面积（㎡）                                                               |  否  | —      |
| `--max-area`       | 最大面积（㎡）                                                               |  否  | —      |
| `--elevator`       | 电梯情况：`1`=无电梯、`2`=有电梯、`3`=电梯入户                               |  否  | —      |
| `--direction`      | 朝向：`东`、`南`、`西`、`北`、`东南`、`东北`、`西南`、`西北`                 |  否  | —      |
| `--area-ids`       | 区域 ID 数组，逗号分隔，如: `440305\|前海,440306\|翻身`                      |  否  | —      |

#### `communities` — 查询小区列表

```bash
xiaolu-house communities
```

| 参数        | 说明                       | 必填 |
| ----------- | -------------------------- | :--: |
| `--name`    | 小区名称，如`澳城花园`     |  否  |
| `--reason`  | 调用这个命令的理由         |  是  |
| `--area-id` | 区域ID，如: `440305\|前海` |  否  |

#### `deals` — 查询二手房成交列表

```bash
xiaolu-house deals
```

| 参数        | 说明                                       | 必填 |
| ----------- | ------------------------------------------ | :--: |
| `--name`    | 小区或学校的名称，如`澳城花园`、`百花小学` |  否  |
| `--reason`  | 调用这个命令的理由                         |  是  |
| `--area-id` | 区域ID，如: `440305\|前海`                 |  否  |

#### `schools` — 查询学校列表

```bash
xiaolu-house schools
```

| 参数         | 说明                                                                                              | 必填 |
| ------------ | ------------------------------------------------------------------------------------------------- | :--: |
| `--name`     | 学校名称，如`百花小学`                                                                            |  否  |
| `--reason`   | 调用这个命令的理由                                                                                |  是  |
| `--type`     | 学校类型：`pri`=小学、`mid`=中学                                                                  |  否  |
| `--nature`   | 学校性质：`1`=公办、`2`=私立                                                                      |  否  |
| `--tiers`    | 梯队：`1`=第一梯队、`2`=第二梯队、`3`=第三梯队、`4`=第四梯队、`999`=无梯队，多个逗号分隔，如`1,2` |  否  |
| `--area-ids` | 区域 ID 数组，逗号分隔，如: `440305\|前海,440306\|翻身`                                           |  否  |

#### `new-communities` — 查询新房列表

```bash
xiaolu-house new-communities
```

| 参数                        | 说明                                                                         | 必填 |
|---------------------------| ---------------------------------------------------------------------------- | :--: |
| `--name`                  | 新房名称，如`开云府`                                                         |  否  |
| `--reason`                | 调用这个命令的理由                                                           |  是  |
| `--rooms`                 | 室数：`1`=1室、`2`=2室、`3`=3室、`4`=4室、`5`=4室以上，多个逗号分隔，如`2,3` |  否  |
| `--property-types`        | 物业类型：`1`=住宅、`2`=商铺、`3`=写字楼                                     |  否  |
| `--sell-status`           | 销售状态：`hot`=热门、`onsell`=在售、`wait`=待售                             |  否  |
| `--min-price`             | 最低价格（万元）                                                             |  否  |
| `--max-price`             | 最高价格（万元）                                                             |  否  |
| `--price-type`            | 价格类型：`totalPrice`=总价、`averagePrice`=均价                             |  否  |
| `--decoration`            | 装修类型：`1`=精装、`2`=简装、`3`=毛坯                                       |  否  |
| `--min-construction-area` | 最小建筑面积（㎡）                                                           |  否  |
| `--max-construction-area` | 最大建筑面积（㎡）                                                           |  否  |
| `--area-id`               | 区域ID，如: `440306\|翻身`                                                   |  否  |

---

### 发布流程

通过 GitHub Actions 自动发布，push tag 后自动触发构建和发布到 npm。

```bash
npm run release           # patch 版本 (1.0.0 -> 1.0.1)
npm run release -- minor  # minor 版本 (1.0.0 -> 1.1.0)
npm run release -- major  # major 版本 (1.0.0 -> 2.0.0)
```

执行流程：

1. 检查 Git 工作区是否干净
2. `npm version` 升级版本号并创建 commit + tag
3. 推送 commit 和 tag 到 GitHub
4. GitHub Actions 自动构建并发布到 npm

**注意事项**：

- 发布前 Git 工作区必须干净，否则会报错退出

---

## License

MIT
