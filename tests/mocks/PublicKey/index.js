const { Purpose, SecurityLevel, KeyType } = require('../../../dist/cjs/wasm/pshenmic_dpp')

module.exports = {
  keyId: 2,
  purpose: Purpose.AUTHENTICATION,
  securityLevel: SecurityLevel.CRITICAL,
  keyType: KeyType.ECDSA_SECP256K1,
  binaryData: '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48',
  keyIdSetted: 3,
  purposeSetted: Purpose.ENCRYPTION,
  securityLevelSetted: SecurityLevel.HIGH,
  keyTypeSetted: KeyType.ECDSA_HASH160,
  binaryDataSetted: '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
}
