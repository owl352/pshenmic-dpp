const { Purpose, SecurityLevel, KeyType } = require('../../..')

module.exports = {
  keyId: 2,
  purpose: 'AUTHENTICATION',
  securityLevel: SecurityLevel.CRITICAL,
  keyType: KeyType.ECDSA_SECP256K1,
  binaryData: '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48',
  keyIdSet: 3,
  purposeSet: Purpose.ENCRYPTION,
  securityLevelSet: SecurityLevel.HIGH,
  keyTypeSet: KeyType.ECDSA_HASH160,
  binaryDataSet: '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
}
