import { describe, it } from 'node:test'
import { spawn } from 'node:child_process'
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const CLI = 'node'
const CLI_ARGS = ['src/index.js']
const CLI_CWD = resolve(__dirname, '..')

// 辅助函数：运行 CLI 命令并收集输出
function runCli(args) {
  return new Promise((resolve) => {
    const proc = spawn(CLI, [...CLI_ARGS, ...args], { cwd: CLI_CWD })
    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', d => (stdout += d.toString()))
    proc.stderr.on('data', d => (stderr += d.toString()))
    proc.on('close', (code) => resolve({ code, stdout, stderr }))
  })
}

// ─── schools 命令 - --keyword 不再与全局 -k 冲突 ───────────────────────────────

describe('schools 命令 - --keyword 选项', () => {
  it('--keyword "育才二小" 正常执行（不走 -k 冲突路径）', async () => {
    const { code, stdout, stderr } = await runCli(['schools', '--keyword', '育才二小'])
    // 如果走了 -k 冲突路径，keyword 丢失，API Key 变成 "育才二小"
    // 会在 stderr 看到 "❌ API Key 无效或已过期" 或 ByteString 错误
    // 正常情况：请求发出（可能因为无 city 配置而报城市未配置）
    const hasApiKeyError = stderr.includes('API Key') || stderr.includes('无效')
    const hasByteStringError = stderr.includes('ByteString')
    const hasCityError = stderr.includes('城市') || stderr.includes('city')

    // 不应该有 ByteString 错误（-k 冲突的标志）
    assert.strictEqual(hasByteStringError, false, `发现 ByteString 错误，说明 -k 冲突未修复: ${stderr}`)
    // 可能 city 未配置，但不应该有 API Key 被覆盖的问题
    if (!hasCityError) {
      // 如果 city 已配置，至少请求发出去了，不应该有 API Key 相关错误
      assert.ok(!hasApiKeyError || hasCityError, `unexpected error: ${stderr}`)
    }
  })

  it('--keyword "测试学校" 同样正常', async () => {
    const { code, stdout, stderr } = await runCli(['schools', '--keyword', '测试学校'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })
})

// ─── new-communities 命令 - --keyword 不再与全局 -k 冲突 ──────────────────────────

describe('new-communities 命令 - --keyword 选项', () => {
  it('--keyword "华润城" 正常执行', async () => {
    const { code, stdout, stderr } = await runCli(['new-communities', '--keyword', '华润城'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })
})

// ─── 其他命令无 -k 冲突 ────────────────────────────────────────────────────────

describe('其他命令无 -k 简写冲突', () => {
  it('houses -a "440305" 正常执行', async () => {
    const { stderr } = await runCli(['houses', '-a', '440305'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })

  it('communities --name "阳光" 正常执行', async () => {
    const { stderr } = await runCli(['communities', '--name', '阳光'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })

  it('deals -a "440305" 正常执行', async () => {
    const { stderr } = await runCli(['deals', '-a', '440305'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })

  it('suggest "育才二小" 正常执行', async () => {
    const { stderr } = await runCli(['suggest', '育才二小'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })
})
