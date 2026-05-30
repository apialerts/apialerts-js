import { describe, expect, it } from 'vitest'
import { INTEGRATION, BASE_URL, TIMEOUT_MS, VERSION } from '../src/constants.js'

describe('constants', () => {
    it('integration name is js', () => {
        expect(INTEGRATION).toBe('js')
    })

    it('base url is the apialerts event endpoint', () => {
        expect(BASE_URL).toBe('https://api.apialerts.com/event')
    })

    it('timeout is 30 seconds per SDK Design spec', () => {
        expect(TIMEOUT_MS).toBe(30_000)
    })

    it('version is 1.x SemVer', () => {
        // Major version pin: bumping to v2.x requires updating this test
        // deliberately. Catches accidental major bumps.
        expect(VERSION).toMatch(/^1\.\d+\.\d+(?:[-+][\w.]+)?$/)
    })
})
