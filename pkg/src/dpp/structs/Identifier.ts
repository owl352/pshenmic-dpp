import {DashPlatformProtocol, IdentifierLike} from "../../types.js";
import {DynamicValue, IdentifierNAPI} from "../../../binaries/bindingsTypes.js";

let dpp: DashPlatformProtocol;

export function setDpp(_dpp: DashPlatformProtocol) {
  dpp = _dpp;
}

export class IdentifierWASM {
  _rawIdentifier: IdentifierNAPI

  constructor(raw_id: IdentifierLike | IdentifierWASM) {
    if (raw_id instanceof IdentifierWASM) {
      return raw_id;
    } else if (typeof raw_id === 'string') {
      const id: DynamicValue = {
        type: "Text",
        field0: raw_id,
      }

      this._rawIdentifier = new dpp.IdentifierNAPI(id);
    } else if (raw_id instanceof Uint8Array) {
      const id: DynamicValue = {
        type: "Bytes",
        field0: raw_id
      }

      this._rawIdentifier = new dpp.IdentifierNAPI(id);
    } else {
      throw new Error("Invalid raw ID");
    }
  }

  base58(): string {
    return this._rawIdentifier.base58();
  }

  base64(): string {
    return this._rawIdentifier.base64();
  }

  hex(): string {
    return this._rawIdentifier.hex();
  }

  bytes(): Uint8Array {
    return this._rawIdentifier.bytes()
  }

  static fromBase58(id: string): IdentifierWASM {
    return this.createFromRawInstance(dpp.IdentifierNAPI.fromBase58(id))
  }

  static fromBase64(id: string): IdentifierWASM {
    return this.createFromRawInstance(dpp.IdentifierNAPI.fromBase64(id))
  }

  static fromHex(id: string): IdentifierWASM {
    return this.createFromRawInstance(dpp.IdentifierNAPI.fromHex(id))
  }

  static fromBytes(id: Uint8Array): IdentifierWASM {
    return this.createFromRawInstance(dpp.IdentifierNAPI.fromBytes(id))
  }

  static createFromRawInstance(rawInstance: IdentifierNAPI): IdentifierWASM {
    const instance: IdentifierWASM = Object.create(this.prototype)
    instance._rawIdentifier = rawInstance

    return instance
  }

  getRawInstance(): IdentifierNAPI {
    return this._rawIdentifier
  }
}
