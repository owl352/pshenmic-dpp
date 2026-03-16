import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

function isMusl() {
  if (process.platform !== 'linux') return false
  const report = process.report?.getReport?.()
  return !report?.header?.glibcVersionRuntime
}

function getBinaryPath() {
  const platform = process.platform
  const arch = process.arch

  let target = ''

  if (platform === 'darwin') {
    target = arch === 'arm64'
      ? 'aarch64-apple-darwin'
      : 'x86_64-apple-darwin'
  }

  else if (platform === 'linux') {
    const libc = isMusl() ? 'musl' : 'gnu'

    if (arch === 'arm64') {
      target = `aarch64-unknown-linux-${libc}`
    } else {
      target = `x86_64-unknown-linux-${libc}`
    }
  }

  else if (platform === 'win32') {
    if (arch === 'arm64') {
      target = 'aarch64-pc-windows-msvc'
    } else {
      target = 'x86_64-pc-windows-msvc'
    }
  }

  else {
    console.error(`Unsupported platform: ${platform} ${arch}. Using WebAssembly instead Node-API`)
    return null
  }

  return path.join('native', target, 'pshenmic_dpp.node')
}

const binaryPath = getBinaryPath()

let exportedModule

if (binaryPath !== null) {
  exportedModule = require(`./${binaryPath}`)
} else {
  exportedModule = await import('./wasm.js')
}

/* exports here */ exportedModule
