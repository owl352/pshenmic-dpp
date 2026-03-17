let exportedModule

const isNode =
  typeof process !== 'undefined' &&
  process.versions?.node

if (isNode) {
  exportedModule = await import('./node.js')
} else {
  exportedModule = await import('./wasm.js')
}

/* exports here */ exportedModule
