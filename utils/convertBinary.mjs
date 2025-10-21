import fs from 'fs';
import {encode} from './base122.mjs';
import zlib from "zlib";

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error("Usage: node <script.js> <input_file> <output_file>");
  process.exit(1);
}

const binaryData = fs.readFileSync(inputFile);
const bufferData = Buffer.from(binaryData);
const compressedChunks = [];

const gzip = zlib.createGzip({
  level: zlib.constants.Z_BEST_COMPRESSION,
  memLevel: zlib.constants.Z_MAX_MEMLEVEL,
});

gzip.on('data', data => {
  compressedChunks.push(...data);
});

gzip.on('end', () => {
  const encodedData = Buffer.from(encode(compressedChunks)).toString('utf-8');
  const outputContent = `const wasmBytes = "${encodedData}"\nexport {wasmBytes}`;

  fs.writeFileSync(outputFile, outputContent);

  console.log(`Successfully converted ${inputFile} to ${outputFile}`);
  process.exit(0);
});

gzip.write(bufferData);
gzip.end();
