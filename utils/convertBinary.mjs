import fs from 'fs'
import { encode } from './base122.mjs'
import zlib from 'zlib'

export async function convertBinary (inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    if (!inputFile || !outputFile) {
      throw new Error('Input or output files not specified')
    }

    const binaryData = fs.readFileSync(inputFile)
    const bufferData = Buffer.from(binaryData)
    const compressedChunks = []

    const gzip = zlib.createGzip({
      level: zlib.constants.Z_BEST_COMPRESSION,
      memLevel: zlib.constants.Z_MAX_MEMLEVEL
    })

    gzip.on('data', data => {
      compressedChunks.push(...data)
    })

    gzip.on('end', () => {
      const encodedData = Buffer.from(encode(compressedChunks)).toString('utf-8')
      const outputContent = `const bytes = "${encodedData}"\nexport {bytes}`

      fs.writeFileSync(outputFile, outputContent)

      console.log(`Successfully converted ${inputFile} to ${outputFile}`)
      resolve()
    })

    gzip.write(bufferData)
    gzip.end()
  })
}
