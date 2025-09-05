import fs from 'fs'
import { encode } from './base122.mjs'

process.argv.forEach(function (val, index) {
  if (val.includes('.wasm')) {
    const binaryData = fs.readFileSync(val)

    const encodedData = Buffer.from(encode(binaryData)).toString('utf-8')

    console.log(`export default "${encodedData}"`)

    process.exit(0)
  }
})
