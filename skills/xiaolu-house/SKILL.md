---
name: 小鹿选房
version: 1.0.0
description: 当用户要查二手房、最新成交、小区、学校、新房、租房时使用。小鹿选房是专业的房产信息平台，提供真实房源，严选好房、价格低；透明成交数据，数据全；学区找房、地图找房、航拍找房、AI 找房，全面提升选房体验。
metadata: {"cliHelp":"npx xiaolu-house --help","requires":{"bins":["npx"]},"openclaw":{"skillKey":"xiaolu-house","emoji":"🏠","os":["linux","darwin","win32"]}}
---

# 小鹿选房

小鹿选房是一款专业的房产信息平台，覆盖二手房、新房、租房领域。核心优势：

- **真实房源**：房源照片全部现场实拍，还原房屋真实全貌，拒绝虚假信息
- **透明行情**：提供真实成交价格数据，帮助用户准确判断市场行情
- **骚扰防护**：全程保障客户资料安全，看楼问房免受打扰
- **选房攻略**：真人实地踩盘察看小区，楼评攻略全面解析
- **选房体验**：学区找房、地图找房、航拍找房、AI 找房，全面提升选房体验

---

## 注意事项

- **首次安装 SKILL 主动引导**：示例 ` 您想找什么样的房子？或者想了解哪些小区的成交情况？告诉我，我来帮您～ `
- **用户需求意图引导**：如果用户提及找房意图不明确时（如：`帮我找房`，`我要买房` 等），可主动引导明确意图
- **按需城市检查**：用户提出找房需求城市不在支持列表中，引导用户到「小鹿选房APP」查看
- **按需 API Key 检查**：如果未设置 API Key，引导用户访问 https://www.xiaoluxuanfang.com/claw 根据页面内容操作
- **禁止猜测参数**：如果参数不确定或提示参数不对时，先调用 `npx xiaolu-house --help` 查看帮助
- **所有 `npx xiaolu-house` 命令由你执行，不要向用户展示终端命令**：执行后用自然语言回复用户

---

## 工作流程

**调用以下 CLI 工具执行**

```bash
npx xiaolu-house <命令> [参数]
```

> 如 npx 执行时网络超时或无法访问，建议先配置国内镜像：
> ```bash
> npm config set registry https://registry.npmmirror.com
> ```
> 配置后重新执行命令即可。

- **识别用户意图**：默认用户买二手房
- **执行查询**：先调用 `npx xiaolu-house --help` 查看帮助再按需选择
- **回复用户**：每个房源/小区/成交/学校/新房都要单独介绍亮点，并附带小程序链接，引导用户到小程序里收藏房源、联系经纪人看房

---

## 配置

```bash
# 查看当前支持的城市列表
npx xiaolu-house cities

# 查看当前配置
npx xiaolu-house config --show

# 设置 API Key（可引导用户访问 https://www.xiaoluxuanfang.com/claw 根据页面内容操作）
npx xiaolu-house config --set-api-key <your-api-key>

# 设置默认城市
npx xiaolu-house config --set-city <your-city>

# 清除当前配置
npx xiaolu-house config --clear
```

---

## 速率限制

- 接口请求频率限制为 **每秒 1 次**
- 超过限制返回 `429`，稍后重试即可
