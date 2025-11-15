import * as protocol from '../binaries/bindingsTypes.js';
import {IdentifierNAPI} from "../binaries/bindingsTypes.js";

export type DashPlatformProtocol = typeof protocol;
export type IdentifierLike = string | Uint8Array | IdentifierNAPI
export type EnumLike = string | number;

export {
  KeyTypeNAPI as KeyType,
  NetworkNAPI as NetworkWASM,
  PlatformVersionNAPI as PlatformVersionWASM,
  PurposeNAPI as Purpose,
  SecurityLevelNAPI as SecurityLevel
} from '../binaries/bindingsTypes.ts'
