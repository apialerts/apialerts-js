import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiAlertsClient } from '../src/index.js'
import { mockFetch, mockFetchError, successBody } from './helpers.js'

afterEach(() => vi.unstubAllGlobals())

// ── Validation ────────────────────────────────────────────────────────────────

describe('validation', () => {
    it('returns failure for empty api key', async () => {
        const result = await new ApiAlertsClient('').sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('api key is missing')
    })

    it('returns failure for whitespace api key', async () => {
        const result = await new ApiAlertsClient('   ').sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('api key is missing')
    })

    it('returns failure for empty message', async () => {
        const result = await new ApiAlertsClient('key').sendAsync({ message: '' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('message is required')
    })
})

// ── Fire-and-forget ───────────────────────────────────────────────────────────

describe('fire-and-forget send()', () => {
    it('does not throw on HTTP error', () => {
        mockFetch(401, {})
        expect(() => new ApiAlertsClient('key').send({ message: 'test' })).not.toThrow()
    })

    it('does not throw on empty message', () => {
        expect(() => new ApiAlertsClient('key').send({ message: '' })).not.toThrow()
    })

    it('does not throw on network error', () => {
        mockFetchError(new Error('Network failure'))
        expect(() => new ApiAlertsClient('key').send({ message: 'test' })).not.toThrow()
    })
})
