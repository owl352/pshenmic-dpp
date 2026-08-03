const path = require('node:path');

function isMusl() {
  if (process.platform !== 'linux')
    return false;
  try {
    const report = process.report?.getReport?.();
    return !report?.header?.glibcVersionRuntime;
  }
  catch {
    // getReport() is unavailable in some embedders/worker contexts; assume
    // glibc, and let the require below fall back to WebAssembly if wrong.
    return false;
  }
}
function getBinaryPath() {
  const platform = process.platform;
  const arch = process.arch;
  let target = '';
  if (platform === 'darwin') {
    target = arch === 'arm64'
      ? 'aarch64-apple-darwin'
      : 'x86_64-apple-darwin';
  }
  else if (platform === 'linux') {
    const libc = isMusl() ? 'musl' : 'gnu';
    if (arch === 'arm64') {
      target = `aarch64-unknown-linux-${libc}`;
    }
    else {
      target = `x86_64-unknown-linux-${libc}`;
    }
  }
  else if (platform === 'win32') {
    if (arch === 'arm64') {
      target = 'aarch64-pc-windows-msvc';
    }
    else {
      target = 'x86_64-pc-windows-msvc';
    }
  }
  else {
    console.error(`Unsupported platform: ${platform} ${arch}. Using WebAssembly instead Node-API`);
    return null;
  }
  return path.join('native', target, 'pshenmic_dpp.node');
}

// The native addon can be unusable even on a supported platform: the binary may
// be missing from the package, built for another libc/arch, or fail to link
// against a system dependency (e.g. the VC++ runtime on Windows). None of that
// should be fatal — WebAssembly is a complete fallback, so any load failure
// degrades to it instead of taking the whole import down.
function loadNative() {
  const binaryPath = getBinaryPath();
  if (binaryPath === null) {
    return null;
  }
  try {
    const nativeModule = require(`./${binaryPath}`);
    console.log(`running on native dpp (${binaryPath})`);
    return nativeModule;
  }
  catch (error) {
    // Only the first line: node appends a multi-line "Require stack" to
    // MODULE_NOT_FOUND messages, which buries the actual reason.
    const reason = String(error?.message ?? error).split('\n')[0];
    console.error(`Failed to load native dpp (${binaryPath}): ${reason}. Using WebAssembly instead Node-API`);
    return null;
  }
}

module.exports = loadNative() ?? require('./wasmCreation.cjs');
