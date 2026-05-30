import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiAlerts } from '../src/index.js'
import { mockFetch, mockFetchError, successBody, capturedHeaders } from './helpers.js'

afterEach(() => {
    vi.unstubAllGlobals()
    ApiAlerts._reset()
})

// ── Validation ────────────────────────────────────────────────────────────────

describe('validation', () => {
    it('returns failure for empty api key', async () => {
        ApiAlerts.configure('')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('api key is missing')
    })

    it('returns failure for whitespace api key', async () => {
        ApiAlerts.configure('   ')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('api key is missing')
    })

    it('returns failure for empty message', async () => {
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: '' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('message is required')
    })
})

// ── Fire-and-forget ───────────────────────────────────────────────────────────

describe('fire-and-forget send()', () => {
    it('does not throw on HTTP error', () => {
        mockFetch(401, {})
        ApiAlerts.configure('key')
        expect(() => ApiAlerts.send({ message: 'test' })).not.toThrow()
    })

    it('does not throw on empty message', () => {
        ApiAlerts.configure('key')
        expect(() => ApiAlerts.send({ message: '' })).not.toThrow()
    })

    it('does not throw on network error', () => {
        mockFetchError(new Error('Network failure'))
        ApiAlerts.configure('key')
        expect(() => ApiAlerts.send({ message: 'test' })).not.toThrow()
    })
})

// ── Singleton ─────────────────────────────────────────────────────────────────

describe('ApiAlerts singleton', () => {
    it('sendAsync returns failure before configure()', async () => {
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('client not configured')
    })

    it('send() is a no-op before configure() and does not throw', () => {
        expect(() => ApiAlerts.send({ message: 'test' })).not.toThrow()
    })

    it('configure() initializes and sendAsync returns success result', async () => {
        mockFetch(200, successBody('W', 'C'))
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(true)
        expect(result.workspace).toBe('W')
    })

    it('configure() is idempotent — second call ignored', async () => {
        mockFetch(200, successBody())
        ApiAlerts.configure('first-key')
        ApiAlerts.configure('second-key')
        await ApiAlerts.sendAsync({ message: 'test' })
        expect(capturedHeaders()['authorization']).toBe('Bearer first-key')
    })

    it('sendWithKeyAsync returns failure before configure()', async () => {
        const result = await ApiAlerts.sendWithKeyAsync('key', { message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('client not configured')
    })

    it('sendWithKeyAsync uses override key after configure()', async () => {
        mockFetch(200, successBody('W', 'C'))
        ApiAlerts.configure('original-key')
        const result = await ApiAlerts.sendWithKeyAsync('override-key', { message: 'test' })
        expect(result.success).toBe(true)
        expect(capturedHeaders()['authorization']).toBe('Bearer override-key')
    })
})
