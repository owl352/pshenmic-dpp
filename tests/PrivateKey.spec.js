const assert = require('assert');
const initWasm = require('./utils/wasm')
const {wif, bytes} = require('./mocks/PrivateKey')

let wasm

describe('PrivateKey', function () {

  before(async function() {
    wasm = initWasm()
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
