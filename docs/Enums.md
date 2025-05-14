# Enums

`pshenmic-dpp` contains some enums, which also used in `rs-dpp`

Currently available enums:

- `BatchTypeWASM`
- `KeyTypeWASM`
- `PurposeWASM`
- `SecurityLevelWASM`
- `NetworkWASM`
- `PlatformVersionWASM`
- `AssetLockProofTypeWASM`
- `PoolingWASM`

Every enum can be passed in multiple formats:

- `KeyTypeWASM.ECDSA_SECP256K1`
- `'ECDSA_SECP256K1'`
- `'ecdsa_secp256k1'`
- `KeyTypeWASM[0]`
- `0`

___

## Enums Values

### `BatchTypeWASM`

- `Create`
- `Replace`
- `Delete`
- `Transfer`
- `Purchase`
- `UpdatePrice`

___

### `KeyTypeWASM`

- `ECDSA_SECP256K1`
- `BLS12_381`
- `ECDSA_HASH160`
- `BIP13_SCRIPT_HASH`
- `EDDSA_25519_HASH160`

___

### `PurposeWASM`

- `AUTHENTICATION`
- `ENCRYPTION`
- `DECRYPTION`
- `TRANSFER`
- `SYSTEM`
- `VOTING`
- `OWNER`

___

### `SecurityLevelWASM`

- `MASTER`
- `CRITICAL`
- `HIGH`
- `MEDIUM`

___

### `NetworkWASM`

- `Mainnet`
- `Testnet`
- `Devnet`
- `Regtest`

___

### `PlatformVersionWASM`

- `PLATFORM_V1`
- `PLATFORM_V2`
- `PLATFORM_V3`
- `PLATFORM_V4`
- `PLATFORM_V5`
- `PLATFORM_V6`
- `PLATFORM_V7`
- `PLATFORM_V8`

___

### `AssetLockProofTypeWASM`

- `Chain`
- `Instant`

___

### `PoolingWASM`

- `Never`
- `IfAvailable`
- `Standard`
