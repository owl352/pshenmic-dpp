import { IdentifierWASM } from "../../dist/src/wasm.js";

let identifierBytes: Uint8Array;

describe("Identifier", function () {
  beforeAll(async function () {
    identifierBytes = Uint8Array.from([
      9, 40, 40, 237, 192, 129, 211, 186, 26, 84, 240, 67, 37, 155, 148, 19,
      104, 242, 199, 24, 136, 27, 6, 169, 211, 71, 136, 59, 33, 191, 227, 19,
    ]);
  });

  describe("serialization / deserialization", function () {
    test("should allows to create Identifier from base58", function () {
      const identifier = IdentifierWASM.fromBase58(
        "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U",
      );

      expect(identifier.bytes()).toEqual(identifierBytes);
    });

    test("should allows to create Identifier from base64", function () {
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

    test("should allows to create Identifier from Identifier", function () {
      const identifier = IdentifierWASM.fromBytes(identifierBytes);
      const identifier2 = new IdentifierWASM(identifier);

      expect(identifier2.bytes()).toEqual(identifierBytes);
    });

    test("should allows to create Identifier from bytes in constructor", function () {
      const identifier = new IdentifierWASM(identifierBytes);

      expect(identifier.bytes()).toEqual(identifierBytes);
    });

    test("should allows to create Identifier from base58 in constructor", function () {
      const identifier = new IdentifierWASM(
        "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U",
      );

      expect(identifier.bytes()).toEqual(identifierBytes);
    });
  });

  describe("getters", function () {
    test("should allow to get identifier base58", function () {
      const identifier = IdentifierWASM.fromBase58(
        "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U",
      );

      expect(identifier.base58()).toEqual(
        "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U",
      );
    });

    test("should allow to get identifier base64", function () {
      const identifier = IdentifierWASM.fromBase58(
        "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U",
      );

      expect(identifier.base64()).toEqual(
        "CSgo7cCB07oaVPBDJZuUE2jyxxiIGwap00eIOyG/4xM=",
      );
    });

    test("should allow to get identifier hex", function () {
      const identifier = IdentifierWASM.fromBase58(
        "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U",
      );

      expect(identifier.hex()).toEqual(
        "092828edc081d3ba1a54f043259b941368f2c718881b06a9d347883b21bfe313",
      );
    });

    test("should allow to get identifier bytes", function () {
      const identifier = IdentifierWASM.fromBase58(
        "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U",
      );

      expect(identifier.bytes()).toEqual(identifierBytes);
    });
  });
});
