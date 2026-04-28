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
    proc.stdout.on('data', (d) => (stdout += d.toString()))
    proc.stderr.on('data', (d) => (stderr += d.toString()))
    proc.on('close', (code) => resolve({ code, stdout, stderr }))
  })
}

// ─── 长参数正常解析 ─────────────────────────────────────────────────────────────

describe('CLI 长参数', () => {
  it('schools --name "育才二小" 正常执行', async () => {
    const { stderr } = await runCli(['schools', '--name', '育才二小'])
    const hasApiKeyError = stderr.includes('API Key') || stderr.includes('无效')
    const hasByteStringError = stderr.includes('ByteString')
    const hasCityError = stderr.includes('城市') || stderr.includes('city')

    assert.strictEqual(
      hasByteStringError,
      false,
      `发现 ByteString 错误，说明 -k 冲突未修复: ${stderr}`,
    )
    if (!hasCityError) {
      assert.ok(!hasApiKeyError || hasCityError, `unexpected error: ${stderr}`)
    }
  })

  it('new-communities --name "华润城" 正常执行', async () => {
    const { stderr } = await runCli(['new-communities', '--name', '华润城'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })

  it('houses --area-ids "440305|前海" 正常执行', async () => {
    const { stderr } = await runCli(['houses', '--area-ids', '440305|前海'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })

  it('communities --name "阳光" 正常执行', async () => {
    const { stderr } = await runCli(['communities', '--name', '阳光'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })

  it('deals --area-id "440305|前海" 正常执行', async () => {
    const { stderr } = await runCli(['deals', '--area-id', '440305|前海'])
    const hasByteStringError = stderr.includes('ByteString')
    assert.strictEqual(hasByteStringError, false, `ByteString 错误: ${stderr}`)
  })
})
