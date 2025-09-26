import fs from 'fs'
import { encode } from './base122.mjs'
import zlib from "zlib";

process.argv.forEach(function (val, index) {
  if (val.includes('.wasm')) {
    const binaryData = fs.readFileSync(val)

    const bufferData = Buffer.from(binaryData)

    const compressedChunks = [];

    const gzip = zlib.createGzip({
      level: 9,
      memLevel: 9
    })

    gzip.on('data', data => {
      compressedChunks.push(...data)
    })

    gzip.on('end', () => {
      const encodedData = Buffer.from(encode(compressedChunks)).toString('utf-8')

      console.log(`export default "${encodedData}"`)

      process.exit(0)
    })

    gzip.write(bufferData)

    gzip.end()
  }
})
