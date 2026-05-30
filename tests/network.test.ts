import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiAlerts } from '../src/index.js'
import type { Event } from '../src/event.js'
import { mockFetch, mockFetchError, successBody, capturedBody, capturedHeaders } from './helpers.js'

afterEach(() => {
    vi.unstubAllGlobals()
    ApiAlerts._reset()
})

// ── HTTP status codes ─────────────────────────────────────────────────────────

describe('HTTP status codes', () => {
    it('200 returns success SendResult', async () => {
        mockFetch(200, successBody('W', 'C'))
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(true)
        expect(result.workspace).toBe('W')
        expect(result.channel).toBe('C')
        expect(result.warnings).toEqual([])
    })

    it('200 surfaces warnings', async () => {
        mockFetch(200, successBody('W', 'C', ['deprecated']))
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(true)
        expect(result.warnings).toEqual(['deprecated'])
    })

    it('400 returns failure with bad request error', async () => {
        mockFetch(400, {})
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('bad request')
    })

    it('401 returns failure with unauthorized error', async () => {
        mockFetch(401, {})
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('unauthorized')
    })

    it('403 returns failure with forbidden error', async () => {
        mockFetch(403, {})
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('forbidden')
    })

    it('429 returns failure with rate limit error', async () => {
        mockFetch(429, {})
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('rate limit exceeded')
    })

    it('500 returns failure with unexpected status error', async () => {
        mockFetch(500, {})
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('unexpected status: 500')
    })

    it('bad JSON returns failure with invalid response error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            status: 200,
            json: () => Promise.reject(new SyntaxError('Unexpected token')),
        }))
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('invalid response from server')
    })

    it('network error returns failure with error message', async () => {
        mockFetchError(new Error('Network failure'))
        ApiAlerts.configure('key')
        const result = await ApiAlerts.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('Network failure')
    })
})

// ── Request headers ───────────────────────────────────────────────────────────

describe('request headers', () => {
    beforeEach(() => mockFetch(200, successBody()))

    it('sends Authorization header', async () => {
        ApiAlerts.configure('my-api-key')
        await ApiAlerts.sendAsync({ message: 'test' })
        expect(capturedHeaders()['authorization']).toBe('Bearer my-api-key')
    })

    it('sends X-Integration header as js', async () => {
        ApiAlerts.configure('key')
        await ApiAlerts.sendAsync({ message: 'test' })
        expect(capturedHeaders()['x-integration']).toBe('js')
    })

    it('setOverrides changes integration headers', async () => {
        ApiAlerts.configure('key')
        ApiAlerts.setOverrides('notify-action', '1.0.0')
        await ApiAlerts.sendAsync({ message: 'test' })
        expect(capturedHeaders()['x-integration']).toBe('notify-action')
        expect(capturedHeaders()['x-version']).toBe('1.0.0')
    })

    it('sendWithKeyAsync uses override key', async () => {
        ApiAlerts.configure('original-key')
        await ApiAlerts.sendWithKeyAsync('override-key', { message: 'test' })
        expect(capturedHeaders()['authorization']).toBe('Bearer override-key')
    })
})

// ── Payload serialization ─────────────────────────────────────────────────────

describe('payload serialization', () => {
    beforeEach(() => mockFetch(200, successBody('W', 'developer')))

    it('serializes all fields', async () => {
        const event: Event = {
            message: 'Full payload',
            channel: 'developer',
            event: 'ci.deploy',
            title: 'Deployed',
            tags: ['CI/CD', 'JS'],
            link: 'https://github.com',
            data: { version: '2.0.0' },
        }
        ApiAlerts.configure('key')
        await ApiAlerts.sendAsync(event)
        const body = capturedBody()
        expect(body.message).toBe('Full payload')
        expect(body.channel).toBe('developer')
        expect(body.event).toBe('ci.deploy')
        expect(body.title).toBe('Deployed')
        expect(body.tags).toEqual(['CI/CD', 'JS'])
        expect(body.link).toBe('https://github.com')
        expect(body.data).toEqual({ version: '2.0.0' })
    })

    it('omits undefined fields', async () => {
        ApiAlerts.configure('key')
        await ApiAlerts.sendAsync({ message: 'minimal' })
        const body = capturedBody()
        expect(body).not.toHaveProperty('channel')
        expect(body).not.toHaveProperty('event')
        expect(body).not.toHaveProperty('title')
        expect(body).not.toHaveProperty('tags')
        expect(body).not.toHaveProperty('link')
        expect(body).not.toHaveProperty('data')
    })
})
