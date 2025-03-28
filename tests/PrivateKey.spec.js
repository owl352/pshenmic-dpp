const assert = require('assert');
const initWasm = require('./utils/wasm')


let wasm
let wif
let bytes

describe('PrivateKey', function () {

  before(async function() {
    wasm = initWasm()

    wif = 'cR4EZ2nAvCmn2cFepKn7UgSSQFgFTjkySAchvcoiEVdm48eWjQGn'
    bytes = [103, 173, 22, 105, 216, 130, 218, 37, 107, 111, 160, 94, 27, 10, 227, 132, 166, 172, 138, 237, 20, 110, 165, 54, 2, 184, 255, 14, 30, 156, 24, 233]
  })

  describe('conversations', function () {
    it('should allows to create PrivateKey from wif', function () {
      let pkey = new wasm.PrivateKeyWASM(wif)

      assert.notEqual(pkey.__wbg_ptr, 0)
    });

    it('should allow to create PrivateKey from wif and read value in wif', function () {
      let pkey = new wasm.PrivateKeyWASM(wif)

      assert.equal(pkey.getKeyWIF(), wif)
    })

    it('should allow to create PrivateKey from wif and write value in bytes', function () {
      let pkey = new wasm.PrivateKeyWASM(wif)

      assert.deepEqual(pkey.getKeyBytes(), Uint8Array.from(bytes))
    })
  });
});
