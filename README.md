# xiaolu-house

小鹿选房命令行工具 — 让人类和 AI Agent 都能在终端中操作小鹿选房。

---

## SKILLS

| Skill | Description |
|-------|-------------|
| `xiaolu-house` | 当用户要查二手房、最新成交、小区、学校、新房、租房时使用 |

---

## CLI

### 安装

```bash
npx xiaolu-house
```

### 发布流程

```bash
# -> 自动完成：bump version + commit + tag + build + publish
npm run release

# 推送到远程
git push && git push --tags
```

**注意事项**：
- 发布前 Git 工作区必须干净，否则会报错退出
- `npm version` 在 lifecycle script 中运行时不会创建 commit/tag，因此使用独立脚本 `scripts/release.sh`

## 命令使用参考

### 配置

```bash
# 查看当前支持的城市列表
npx xiaolu-house cities

# 设置 API Key（访问 https://www.xiaoluxuanfang.com/claw 根据页面内容操作）
npx xiaolu-house config --set-api-key <your-api-key>

# 设置默认城市
npx xiaolu-house config --set-city <your-city>

# 查看当前配置
npx xiaolu-house config --show
```

配置文件：`~/.xiaolu-house/config`

---

### 命令列表

#### `config` — 配置管理

```bash
xiaolu-house config --show  # 查看当前配置
xiaolu-house config --set-api-key <key>  # 设置 API Key
xiaolu-house config --set-city <your-city>  # 设置默认城市
xiaolu-house config --clear  # 清除所有配置
```

#### `cities` — 查看当前支持的城市列表

```bash
xiaolu-house cities
```

#### `areas` — 查看当前城市区域及 areaId

```bash
xiaolu-house areas
```

#### `suggest` — 模糊搜索匹配相关的小区、学校、地铁站、新房

```bash
xiaolu-house suggest <keyword>
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `-t, --type` | `sell`=售房 / `rent`=租房 | `sell` |

#### `houses` — 获取二手房/租房房源列表

```bash
xiaolu-house houses
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `-t, --type` | `sell`=售 / `rent`=租 | `sell` |
| `-a, --area-ids` | areaId，格式 `440305\|南山`，可多次使用 | `[]` |
| `-c, --community-name` | 小区名称关键字 | — |
| `--community-ids` | communityId 列表，逗号分隔 | — |
| `-r, --rooms` | 室数，逗号分隔，如 `2,3` | — |
| `--toilets` | 卫数，如 `1,2` | — |
| `--min-sell-price` | 最低售价（总价万元） | — |
| `--max-sell-price` | 最高售价（总价万元） | — |
| `--min-rent-price` | 最低月租（元） | — |
| `--max-rent-price` | 最高月租（元） | — |
| `--min-area` | 最小面积（㎡） | — |
| `--max-area` | 最大面积（㎡） | — |
| `--elevator` | `1`=无电梯 `2`=有电梯 `3`=电梯入户 | — |
| `--direction` | 朝向，如 `南,东南` | — |
| `--subway-ids` | subwayId，可多次使用 | `[]` |
| `--school-ids` | schoolId，可多次使用 | `[]` |

#### `communities` — 查询小区列表

```bash
xiaolu-house communities
```

| 参数 | 说明 |
|------|------|
| `-n, --community-name` | 小区名称关键字 |
| `-a, --area-ids` | areaId，格式 `440305\|南山` |
| `-i, --community-ids` | communityId 列表，逗号分隔 |

#### `deals` — 查询二手房成交列表

```bash
xiaolu-house deals
```

| 参数 | 说明 |
|------|------|
| `-a, --area-ids` | areaId，格式 `440305\|南山`，可多次使用 |
| `--sub-area` | 片区名称 |
| `-c, --community-ids` | communityId 列表，逗号分隔 |
| `--school-ids` | schoolId 列表，逗号分隔 |

#### `schools` — 查询学校列表

```bash
xiaolu-house schools
```

| 参数 | 说明 |
|------|------|
| `--school-name` | 学校名称关键字 |
| `-t, --type` | `pri`=小学 / `mid`=中学 |
| `--nature` | `1`=公办 / `2`=私立 |
| `--tiers` | 梯队，逗号分隔，如 `1,2` |
| `-a, --area-ids` | areaId 列表，逗号分隔 |
| `-i, --school-ids` | schoolId 列表，逗号分隔 |

#### `new-communities` — 查询新房列表

```bash
xiaolu-house new-communities
```

| 参数 | 说明                                  |
|------|-------------------------------------|
| `--new-community-name` | 新房名称关键字                             |
| `-a, --area-ids` | areaId，格式 `440305\|前海`              |
| `-r, --rooms` | 室数，逗号分隔                             |
| `-p, --property-types` | 物业类型: `1`=住宅 `2`=商铺 `3`=写字楼         |
| `--status` | `hot`=热门 `onsell`=在售 `wait`=待售      |
| `--min-price` | 最低价格（万元）                            |
| `--max-price` | 最高价格（万元）                            |
| `--price-type` | `totalPrice`=总价 / `averagePrice`=均价 |
| `--decoration` | `1`=精装 `2`=简装 `3`=毛坯                |
| `--construction-areas` | 建筑面积区间，格式 `min,max`                 |
| `-i, --new-community-ids` | newCommunityIds 列表，逗号分隔             |

---

## License

MIT
