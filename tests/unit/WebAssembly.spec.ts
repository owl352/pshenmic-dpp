import * as dpp from "pshenmic-dpp/wasm";
import {IdentifierWASM} from "pshenmic-dpp/wasm";

let identifierBytes: Uint8Array;

describe("dpp", function () {
  beforeAll(async function () {
    identifierBytes = Uint8Array.from([
      9, 40, 40, 237, 192, 129, 211, 186, 26, 84, 240, 67, 37, 155, 148, 19,
      104, 242, 199, 24, 136, 27, 6, 169, 211, 71, 136, 59, 33, 191, 227, 19,
    ]);
  });

  it('dpp object shouldn\'t be undefined or empty', () => {
    expect(dpp).toBeDefined();
  });

  describe('classes accesibles', function () {
    test("should allows to create Identifier from base58 via dpp object", function () {
      const identifier = dpp.IdentifierWASM.fromBase58(
        "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U",
      );

      expect(identifier.bytes()).toEqual(identifierBytes);
    });

    test("should allows to create Identifier from base64 via IdentifierWASM import", function () {
      const identifier = IdentifierWASM.fromBase64(
        "CSgo7cCB07oaVPBDJZuUE2jyxxiIGwap00eIOyG/4xM=",
      );

      expect(identifier.bytes()).toEqual(identifierBytes);
    });

    test("should allows to create Identifier from hex", function () {
      const identifier = IdentifierWASM.fromHex(
        "092828edc081d3ba1a54f043259b941368f2c718881b06a9d347883b21bfe313",
      );

      expect(identifier.bytes()).toEqual(identifierBytes);
    });

    test("should allows to create Identifier from bytes", function () {
      const identifier = IdentifierWASM.fromBytes(identifierBytes);

      expect(identifier.bytes()).toEqual(identifierBytes);
    });
  })
});
