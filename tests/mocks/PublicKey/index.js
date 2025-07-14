import { Purpose, SecurityLevel, KeyType } from '../../../dist/wasm/pshenmic_dpp.js'

export const keyId = 2
export const purpose = 'AUTHENTICATION'
export const securityLevel = SecurityLevel.CRITICAL
export const keyType = KeyType.ECDSA_SECP256K1
export const binaryData = '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'

export const keyIdSet = 3
export const purposeSet = Purpose.ENCRYPTION
export const securityLevelSet = SecurityLevel.HIGH
export const keyTypeSet = KeyType.ECDSA_HASH160
export const binaryDataSet = '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
