// Browser e2e proof of the shielded-split fix for dash-platform-extension#219.
//
// Run: node tests/e2e/isolation.spec.mjs   (headless Chromium + Firefox)
//
// THE #219 BUG: the old shared-memory wasm forced sites to serve COOP:
// same-origin + COEP: require-corp. COOP same-origin SEVERS the opener's
// reference to the cross-origin wallet-extension popup, so popup.closed reads
// true while the popup is open -> false "connection rejected". The split lets
// non-proving sites drop COOP/COEP entirely (base loads without isolation);
// proving stays opt-in via initShielded() under COOP: same-origin.
//
// Tests:
//   (a) no headers: base imports + IdentifierWASM works; initShielded()
//       rejects (no SAB); proving classes gated; shielded bytes never loaded.
//   (b) same-origin + require-corp: crossOriginIsolated === true;
//       initShielded() resolves; a REAL shielded transition builds (Halo 2
//       proofs on wasm thread workers) — plus the byte regression vs native.
//   (c) same-origin-allow-popups + require-corp: window.open popup reference
//       RETAINED (popup.closed === false, live postMessage channel) — the
//       #219 crux. NOTE: current browsers do NOT grant crossOriginIsolated
//       for allow-popups (see the long comment above test (c)); the test
//       asserts the observed/spec behavior instead of the outdated premise.
//   (c2) same-origin + require-corp: popup reference SEVERED (popup.closed
//       === true while the popup is demonstrably open) — reproduces #219.
//   (d) base import does NOT fetch/compile the shielded module (lazy):
//       request log + instrumented WebAssembly.Module sizes, before/after
//       initShielded(); repeated calls share one promise.
//   (e) failure -> retry: the shielded chunk 500s once; initShielded()
//       rejects, the cache is cleared, and a retry succeeds.
//
// Byte regression (in test b): proofs/nullifiers/cmxs are OsRng-randomized,
// so browser vs native compares DETERMINISTIC fields (valueBalance,
// assetLockProof, anchor, actionCount, bytesLength) + bytes round-trips +
// cross-instance parses, NOT literal proof bytes.

import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, firefox } from 'playwright'
import { startE2EServer } from '../../scripts/e2e-server.mjs'
import * as native from '../../dist/src/native.js'

const require = createRequire(import.meta.url)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

// Fixed inputs — identical to the Task 4 native baseline script
// (.superpowers/sdd/2026-11-14-shielded-split/t4-baseline.mjs).
const SEED = Array.from({ length: 64 }, (_, i) => (i * 7 + 1) & 0xff)
const WIF = 'cUy4wbim4y9NDwC24omx8oWY5WqfmjSU2gdcZtTXza2xDCAkQXRP'
const TXID = '79af4b339ddfee8c9b6d08d74155373c6ef547cda5e65473a254b9b0f8533f0c'
const CORE_HEIGHT = 1499737
const AMOUNT = '40000000000'
const IDENTIFIER_B58 = 'ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U'
const IDENTIFIER_HEX = '092828edc081d3ba1a54f043259b941368f2c718881b06a9d347883b21bfe313'

const hex = (b) => Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('')
const unhex = (s) => new Uint8Array(s.match(/../g).map((h) => parseInt(h, 16)))

// Actual decompressed module sizes (computed, not hardcoded): the lazy-load
// test asserts which module was compiled from these.
const { decode } = require(path.join(ROOT, 'dist/utils/base122.cjs'))
const { decompressSync } = require('fflate')
const moduleSize = (name) =>
  decompressSync(new Uint8Array(decode(require(path.join(ROOT, `dist/binaries/wasm/${name}.cjs`)).bytes))).length
const BASE_SIZE = moduleSize('baseBytes')
const SHIELDED_SIZE = moduleSize('shieldedBytes')

// Builds the same shieldFromAssetLock transition as the Task 4 baseline,
// in-page, and returns JSON-serializable deterministic fields + full bytes.
async function buildTransitionInPage () {
  const dpp = window.__dpp
  const toHex = (b) => Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('')
  const seed = new Uint8Array(window.__inputs.seed)
  const builder = new dpp.ShieldedBuilderWASM()
  await builder.init()
  const recipient = dpp.OrchardAddressWASM.fromSeed(seed, 1, 0)
  const privateKey = dpp.PrivateKeyWASM.fromWIF(window.__inputs.wif)
  const outPoint = new dpp.OutPointWASM(window.__inputs.txid, 0)
  const assetLockProof = dpp.AssetLockProofWASM.createChainAssetLockProof(window.__inputs.coreHeight, outPoint)
  const memo = dpp.ShieldedMemoWASM.empty()
  const st = await builder.shieldFromAssetLock(
    recipient, BigInt(window.__inputs.amount), assetLockProof, privateKey, memo, 0)
  const t = dpp.ShieldFromAssetLockTransitionWASM.fromStateTransition(st)
  const bytes = st.bytes()
  return {
    valueBalance: t.valueBalance.toString(),
    assetLockProof: toHex(t.assetLockProof.bytes()),
    anchor: toHex(t.anchor),
    actionCount: t.actions.length,
    nullifiers: t.actions.map((a) => toHex(a.nullifier)),
    cmxs: t.actions.map((a) => toHex(a.cmx)),
    bytesHex: toHex(bytes),
    bytesLength: bytes.length,
    roundTripIdentical: toHex(dpp.StateTransitionWASM.fromBytes(bytes).bytes()) === toHex(bytes),
    workers: window.__workers.slice(),
    compiles: window.__wasmCompiles.slice()
  }
}

// Same build on the native addon (the regression oracle).
async function buildTransitionNative () {
  const seed = new Uint8Array(SEED)
  const builder = new native.ShieldedBuilderWASM()
  await builder.init()
  const recipient = native.OrchardAddressWASM.fromSeed(seed, 1, 0)
  const privateKey = native.PrivateKeyWASM.fromWIF(WIF)
  const outPoint = new native.OutPointWASM(TXID, 0)
  const assetLockProof = native.AssetLockProofWASM.createChainAssetLockProof(CORE_HEIGHT, outPoint)
  const memo = native.ShieldedMemoWASM.empty()
  const st = await builder.shieldFromAssetLock(recipient, BigInt(AMOUNT), assetLockProof, privateKey, memo, 0)
  const t = native.ShieldFromAssetLockTransitionWASM.fromStateTransition(st)
  const bytes = st.bytes()
  return {
    valueBalance: t.valueBalance.toString(),
    assetLockProof: hex(t.assetLockProof.bytes()),
    anchor: hex(t.anchor),
    actionCount: t.actions.length,
    bytesHex: hex(bytes),
    bytesLength: bytes.length,
    roundTripIdentical: hex(native.StateTransitionWASM.fromBytes(bytes).bytes()) === hex(bytes)
  }
}

const DETERMINISTIC_FIELDS = ['valueBalance', 'assetLockProof', 'anchor', 'actionCount', 'bytesLength', 'roundTripIdentical']

async function main () {
  const results = []
  const run = async (name, fn) => {
    const t0 = Date.now()
    try {
      await fn()
      results.push({ name, ok: true })
      console.log(`PASS  ${name}  (${Date.now() - t0} ms)`)
    } catch (e) {
      results.push({ name, ok: false })
      console.error(`FAIL  ${name}  (${Date.now() - t0} ms)\n      ${e && e.stack ? e.stack.split('\n').slice(0, 6).join('\n      ') : e}`)
    }
  }

  console.log(`module sizes: base=${BASE_SIZE} shielded=${SHIELDED_SIZE}`)
  console.log('building native baseline transition (regression oracle)...')
  const nativeBaseline = await buildTransitionNative()
  console.log(`native baseline: ${nativeBaseline.bytesLength} bytes, anchor=${nativeBaseline.anchor.slice(0, 16)}...`)

  const srv = await startE2EServer({})
  const popupSrv = await startE2EServer({}) // different port => CROSS-ORIGIN popup target
  console.log(`harness: ${srv.origin} | cross-origin popup target: ${popupSrv.origin}`)

  const browser = await chromium.launch({ headless: true, args: ['--disable-popup-blocking'] })
  const ctx = await browser.newContext()
  const pageErrors = []

  const openPage = async (profile) => {
    const page = await ctx.newPage()
    page.setDefaultTimeout(60000)
    page.on('pageerror', (e) => pageErrors.push(String(e)))
    await page.goto(srv.pageUrl(profile))
    await page.waitForFunction(() => window.__importDone === true || window.__importError != null)
    const importError = await page.evaluate(() => window.__importError ?? null)
    assert.equal(importError, null, `base import failed: ${importError}`)
    return page
  }
  const openPopup = async (page) => {
    await page.evaluate((url) => { window.__popupUrl = url }, popupSrv.popupUrl)
    const [popup] = await Promise.all([
      ctx.waitForEvent('page', { timeout: 15000 }),
      page.click('#popup-btn') // real user gesture -> window.open
    ])
    await popup.waitForLoadState('load')
    await page.waitForTimeout(300) // let the COOP browsing-context-group swap settle
    return popup
  }
  const shieldedRequests = () => srv.requests.filter((r) => r.path === srv.bundle.shieldedPath)

  try {
    // ------------------------------------------------------------------ (a)
    await run('(a) no headers: base works without isolation, initShielded rejects, proving gated', async () => {
      const page = await openPage('none')
      const r = await page.evaluate(async (inputs) => {
        const dpp = window.__dpp
        const toHex = (b) => Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('')
        const id = dpp.IdentifierWASM.fromBase58(inputs.b58)
        const roundTrip = dpp.IdentifierWASM.fromBytes(id.bytes()).base58()
        let initErr = null
        try { await dpp.initShielded() } catch (e) { initErr = String(e) }
        let builderErr = null
        try { await new dpp.ShieldedBuilderWASM().init() } catch (e) { builderErr = String(e) }
        let addrErr = null
        try { dpp.OrchardAddressWASM.fromSeed(new Uint8Array(64).fill(7), 1, 0) } catch (e) { addrErr = String(e) }
        return {
          isolated: crossOriginIsolated,
          sab: typeof SharedArrayBuffer,
          idHex: toHex(id.bytes()),
          roundTrip,
          initErr,
          builderErr,
          addrErr,
          compiles: window.__wasmCompiles
        }
      }, { b58: IDENTIFIER_B58 })
      assert.equal(r.isolated, false)
      assert.equal(r.sab, 'undefined')
      assert.equal(r.idHex, IDENTIFIER_HEX)
      assert.equal(r.roundTrip, IDENTIFIER_B58)
      assert.match(r.initErr, /SharedArrayBuffer/)
      assert.match(r.initErr, /cross-origin isolation/)
      assert.match(r.builderErr, /initShielded/)
      assert.match(r.addrErr, /initShielded/)
      assert.deepEqual(r.compiles, [BASE_SIZE]) // only the base module compiled
      assert.equal(shieldedRequests().length, 0) // shielded chunk never even fetched
      await page.close()
    })

    // ------------------------------------------------------------------ (b)
    await run('(b) same-origin+require-corp: isolated, initShielded resolves, REAL proving + byte regression', async () => {
      const page = await openPage('same-origin')
      const iso = await page.evaluate(() => ({ isolated: crossOriginIsolated, sab: typeof SharedArrayBuffer }))
      assert.equal(iso.isolated, true)
      assert.equal(iso.sab, 'function')
      await page.evaluate((inputs) => { window.__inputs = inputs },
        { seed: SEED, wif: WIF, txid: TXID, coreHeight: CORE_HEIGHT, amount: AMOUNT })
      await page.evaluate(`window.__buildTransition = ${buildTransitionInPage.toString()}`)
      // Real proving: Halo 2 proving key + 2 proofs on wasm thread workers.
      const browserResult = await page.evaluate(async (timeoutMs) => {
        const work = (async () => {
          await window.__dpp.initShielded()
          return await window.__buildTransition()
        })()
        return await Promise.race([
          work,
          new Promise((_, rej) => setTimeout(() => rej(new Error('in-browser proving timed out after ' + timeoutMs + 'ms')), timeoutMs))
        ])
      }, 240000)
      assert.equal(browserResult.roundTripIdentical, true)
      assert.ok(browserResult.workers.length > 0, 'wasm thread workers must have spawned')
      assert.ok(browserResult.workers.every((w) => w.startsWith('blob:')), 'workers spawn from Blob URLs')
      assert.ok(browserResult.compiles.includes(SHIELDED_SIZE), 'shielded module compiled after initShielded')
      // Byte regression vs native: deterministic fields only (proofs,
      // nullifiers and cmxs are OsRng-randomized — never compared literally).
      for (const field of DETERMINISTIC_FIELDS) {
        assert.deepEqual(browserResult[field], nativeBaseline[field], `deterministic field mismatch: ${field}`)
      }
      // Cross-instance structural validation: each side parses the other's
      // bytes and re-serializes identically.
      const nativeParsesBrowser = hex(native.StateTransitionWASM.fromBytes(unhex(browserResult.bytesHex)).bytes()) === browserResult.bytesHex
      assert.equal(nativeParsesBrowser, true, 'native must parse+re-serialize browser bytes identically')
      const browserParsesNative = await page.evaluate((nativeHex) => {
        const bytes = new Uint8Array(nativeHex.match(/../g).map((h) => parseInt(h, 16)))
        const re = window.__dpp.StateTransitionWASM.fromBytes(bytes).bytes()
        return Array.from(re).map((x) => x.toString(16).padStart(2, '0')).join('') === nativeHex
      }, nativeBaseline.bytesHex)
      assert.equal(browserParsesNative, true, 'browser must parse+re-serialize native bytes identically')
      console.log(`      browser transition: ${browserResult.bytesLength} bytes, ${browserResult.workers.length} blob workers, deterministic fields == native`)
      await page.close()
    })

    // ------------------------------------------------------------------ (c)
    // ESCALATION (observed in Chrome 157/159 headless+headful AND Firefox,
    // matching the current HTML spec): COOP same-origin-allow-popups does NOT
    // grant cross-origin isolation. The spec only promotes COOP same-origin +
    // compatible COEP to "same-origin-plus-COEP" (which sets the BCG's
    // cross-origin isolation mode); for same-origin-allow-popups the COEP
    // header is never consulted, so crossOriginIsolated stays false and SAB
    // is unavailable. The original task premise ("allow-popups keeps
    // crossOriginIsolated=true AND retains popup references") is outdated:
    // NO current header combination gives both SAB and cross-origin popup
    // references. What IS provable — and is the #219 crux — is that
    // allow-popups retains the popup reference while same-origin severs it.
    // Proving sites must use COOP same-origin (test b); connect-only sites
    // (the #219 extension flow) drop COOP/COEP entirely (test a).
    await run('(c) allow-popups+require-corp: popup reference RETAINED (#219 crux); isolation NOT granted (spec reality)', async () => {
      const page = await openPage('allow-popups')
      const iso = await page.evaluate(() => ({ isolated: crossOriginIsolated, sab: typeof SharedArrayBuffer }))
      assert.equal(iso.isolated, false, 'current Chrome/Firefox: allow-popups does not grant crossOriginIsolated')
      assert.equal(iso.sab, 'undefined')
      const gate = await page.evaluate(async () => {
        try { await window.__dpp.initShielded(); return null } catch (e) { return String(e) }
      })
      assert.match(gate, /SharedArrayBuffer/, 'initShielded must reject without SAB even under allow-popups')
      // The crux: the opener KEEPS a live reference to the cross-origin popup.
      const popup = await openPopup(page)
      assert.equal(await page.evaluate(() => window.__popup.closed), false, 'popup.closed must stay false while the popup is open')
      assert.equal(await popup.evaluate(() => window.opener != null), true, 'popup keeps window.opener')
      // Live bidirectional postMessage channel proves the reference is usable,
      // not merely non-null.
      await page.evaluate(() => window.__popup.postMessage('ping-from-opener', '*'))
      await page.waitForFunction(() => window.__popupMessages.includes('pong:ping-from-opener'), null, { timeout: 5000 })
      await popup.evaluate(() => window.opener.postMessage('ping-from-popup', '*'))
      await page.waitForFunction(() => window.__popupMessages.includes('ping-from-popup'), null, { timeout: 5000 })
      console.log('      popup.closed=false, window.opener live, postMessage round-trip OK (cross-origin popup)')
      await popup.close()
      await page.close()
    })

    // ----------------------------------------------------------------- (c2)
    await run('(c2) same-origin+require-corp: popup reference SEVERED — reproduces #219 false rejection', async () => {
      const page = await openPage('same-origin')
      const popup = await openPopup(page)
      // The #219 symptom: opener reads closed===true ...
      assert.equal(await page.evaluate(() => window.__popup.closed), true)
      // ... while the popup is demonstrably OPEN and scriptable.
      assert.equal(await popup.evaluate(() => document.readyState), 'complete')
      assert.equal(await popup.evaluate(() => { window.__aliveMarker = 42; return window.__aliveMarker }), 42)
      assert.equal(await popup.evaluate(() => window.opener === null), true, 'popup loses window.opener')
      assert.equal(await popup.title(), 'popup:no-opener')
      // postMessage into the severed WindowProxy is a silent no-op.
      await page.evaluate(() => window.__popup.postMessage('ping', '*'))
      await page.waitForTimeout(750)
      assert.deepEqual(await page.evaluate(() => window.__popupMessages), [])
      console.log('      popup.closed=true while popup open+scriptable, opener=null — the exact #219 failure mode')
      await popup.close()
      await page.close()
    })

    // ------------------------------------------------------------------ (d)
    await run('(d) lazy: base import neither fetches nor compiles shielded; initShielded does both, once', async () => {
      const page = await openPage('same-origin')
      const reqsBefore = shieldedRequests().length
      const atImport = await page.evaluate(() => ({
        compiles: window.__wasmCompiles, workers: window.__workers.length
      }))
      assert.ok(atImport.compiles.includes(BASE_SIZE), 'base compiled at import')
      assert.ok(!atImport.compiles.includes(SHIELDED_SIZE), 'shielded NOT compiled at import')
      assert.equal(atImport.workers, 0, 'no workers at import')
      assert.equal(shieldedRequests().length, reqsBefore, 'shielded chunk NOT fetched at import')
      const r = await page.evaluate(async () => {
        const dpp = window.__dpp
        const p1 = dpp.initShielded()
        const p2 = dpp.initShielded()
        await p1
        return { samePromise: p1 === p2, compiles: window.__wasmCompiles }
      })
      assert.equal(r.samePromise, true, 'concurrent/repeated initShielded shares one promise')
      assert.ok(r.compiles.includes(SHIELDED_SIZE), 'shielded compiled after initShielded')
      assert.equal(shieldedRequests().length - reqsBefore, 1, 'shielded chunk fetched exactly once')
      await page.close()
    })

    // ------------------------------------------------------------------ (e)
    await run('(e) failure->retry: shielded chunk 500s once, initShielded rejects, retry succeeds (cache cleared)', async () => {
      const page = await openPage('same-origin')
      const reqsBefore = shieldedRequests().length
      srv.failNextShieldedOnce()
      const r = await page.evaluate(async () => {
        const dpp = window.__dpp
        const p1 = dpp.initShielded()
        let err1 = null
        try { await p1 } catch (e) { err1 = String((e && e.message) || e) }
        const p2 = dpp.initShielded()
        let err2 = null
        try { await p2 } catch (e) { err2 = String((e && e.message) || e) }
        let addrOk = false
        try { dpp.OrchardAddressWASM.fromSeed(new Uint8Array(64).fill(7), 1, 0); addrOk = true } catch (e) {}
        return { err1, err2, samePromise: p1 === p2, addrOk }
      })
      assert.ok(r.err1 != null, 'first initShielded must reject when the chunk fails to load')
      assert.equal(r.err2, null, `retry must succeed, got: ${r.err2}`)
      assert.equal(r.samePromise, false, 'failed promise must be cleared from the cache')
      assert.equal(r.addrOk, true, 'shielded classes usable after retry')
      const reqs = shieldedRequests().slice(reqsBefore)
      assert.equal(reqs.length, 2, 'shielded chunk fetched twice (fail then retry)')
      assert.deepEqual(reqs.map((x) => x.status), [500, 200])
      console.log(`      first load rejected: ${r.err1.slice(0, 90)}...`)
      await page.close()
    })

    // ------------------------------------------- Firefox cross-browser check
    // The COOP/popup mechanism is spec-defined; verify Firefox agrees on the
    // isolation flags and the popup retention/severance matrix (no proving).
    const fxBrowser = await firefox.launch({ headless: true })
    const fxCtx = await fxBrowser.newContext()
    try {
      for (const [profile, expectIsolated, expectClosed] of [
        ['same-origin', true, true],
        ['allow-popups', false, false]
      ]) {
        await run(`firefox: ${profile} -> isolated=${expectIsolated}, popup.closed=${expectClosed}`, async () => {
          const page = await fxCtx.newPage()
          page.setDefaultTimeout(60000)
          await page.goto(srv.pageUrl(profile))
          await page.waitForFunction(() => window.__importDone === true || window.__importError != null)
          assert.equal(await page.evaluate(() => window.__importError ?? null), null)
          assert.equal(await page.evaluate(() => crossOriginIsolated), expectIsolated)
          await page.evaluate((url) => { window.__popupUrl = url }, popupSrv.popupUrl)
          const [popup] = await Promise.all([
            fxCtx.waitForEvent('page', { timeout: 15000 }),
            page.click('#popup-btn')
          ])
          await popup.waitForLoadState('load')
          await page.waitForTimeout(300)
          assert.equal(await page.evaluate(() => window.__popup.closed), expectClosed)
          assert.equal(await popup.evaluate(() => window.opener != null), !expectClosed)
          await popup.close()
          await page.close()
        })
      }
    } finally {
      await fxBrowser.close()
    }
  } finally {
    await browser.close()
    await srv.close()
    await popupSrv.close()
  }

  if (pageErrors.length > 0) {
    console.log('\npage errors observed (diagnostics):')
    for (const e of pageErrors.slice(0, 10)) console.log('  ' + e.split('\n')[0])
  }
  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} e2e tests passed`)
  if (failed.length > 0) {
    console.log('FAILED: ' + failed.map((f) => f.name).join(' | '))
    process.exitCode = 1
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1 })