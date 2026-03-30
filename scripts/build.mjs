#!/usr/bin/env node
import * as esbuild from 'esbuild'
import { readFileSync, writeFileSync, chmodSync, mkdirSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const CLI_DIR = join(dirname(__filename), '..')
const DIST_DIR = join(CLI_DIR, 'dist')

rmSync(DIST_DIR, { recursive: true, force: true })
mkdirSync(DIST_DIR, { recursive: true })

const cjsPath = join(DIST_DIR, 'xiaolu-house.cjs')
const launcherPath = join(DIST_DIR, 'xiaolu-house')

console.log('==> Bundling with esbuild (CJS)...')

await esbuild.build({
  entryPoints: [join(CLI_DIR, 'src/index.js')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: cjsPath,
  external: [
    'fs', 'os', 'path', 'url', 'process', 'util', 'querystring',
    'node:fs', 'node:os', 'node:path', 'node:url', 'node:process', 'node:util',
    'node:events', 'node:buffer', 'node:stream', 'node:http', 'node:https',
  ],
  minify: false,
  sourcemap: false,
  target: 'node18',
})

const code = readFileSync(cjsPath, 'utf-8')

// Terser minify
console.log('==> Minifying with terser...')
const { minify } = await import('terser')
const result = await minify(code, {
  ecma: 2022,
  mangle: { toplevel: true },
  compress: { passes: 3, dead_code: true, drop_console: false },
})
if (result.error) throw result.error
writeFileSync(cjsPath, result.code)
chmodSync(cjsPath, 0o755)
console.log('  -> ' + cjsPath + ' (' + result.code.length + ' chars)')

// Shell launcher wrapper
const launcherContent = [
  '#!/bin/sh',
  'basedir=$(dirname "$(readlink -f "$0" 2>/dev/null || echo "$0")")',
  'exec node "$basedir/xiaolu-house.cjs" "$@"',
].join('\n')

writeFileSync(launcherPath, launcherContent)
chmodSync(launcherPath, 0o755)
console.log('  -> ' + launcherPath)

console.log('\nDone!')
console.log('  dist/xiaolu-house.cjs       # 单文件（强制 CJS）')
console.log('  dist/xiaolu-house           # 直接执行脚本')
