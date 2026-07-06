let sharedMemory = new WebAssembly.Memory({
  initial: 1000,
  maximum: 12000,
  shared: true
});

module.exports.default = sharedMemory;
