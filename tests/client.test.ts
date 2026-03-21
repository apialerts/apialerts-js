import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiAlerts, ApiAlertsClient } from '../src/index.js'
import type { Event } from '../src/event.js'

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockFetch(status: number, body: unknown): void {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        status,
        json: () => Promise.resolve(body),
    }))
}

function mockFetchError(error: Error): void {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error))
}

function successBody(workspace = 'My Workspace', channel = 'general', warnings: string[] = []) {
    return { workspace, channel, warnings }
}

function capturedOptions(): RequestInit {
    return (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit
}

function capturedBody(): Record<string, unknown> {
    return JSON.parse(capturedOptions().body as string)
}

function capturedHeaders(): Record<string, string> {
    const raw = capturedOptions().headers as Record<string, string>
    const headers: Record<string, string> = {}
    for (const [k, v] of Object.entries(raw)) {
        headers[k.toLowerCase()] = v
    }
    return headers
}

// ── Setup ─────────────────────────────────────────────────────────────────────

afterEach(() => {
    vi.unstubAllGlobals()
    ApiAlerts._reset()
})

// ── Validation ────────────────────────────────────────────────────────────────

describe('validation', () => {
    it('returns failure for empty api key', async () => {
        const client = new ApiAlertsClient('')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('api key is missing')
    })

    it('returns failure for whitespace api key', async () => {
        const client = new ApiAlertsClient('   ')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('api key is missing')
    })

    it('returns failure for empty message', async () => {
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: '' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('message is required')
    })
})

// ── HTTP status codes ─────────────────────────────────────────────────────────

describe('HTTP status codes', () => {
    it('200 returns success SendResult', async () => {
        mockFetch(200, successBody('W', 'C'))
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(true)
        expect(result.workspace).toBe('W')
        expect(result.channel).toBe('C')
        expect(result.warnings).toEqual([])
    })

    it('200 surfaces warnings', async () => {
        mockFetch(200, successBody('W', 'C', ['deprecated']))
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(true)
        expect(result.warnings).toEqual(['deprecated'])
    })

    it('400 returns failure with bad request error', async () => {
        mockFetch(400, {})
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('bad request')
    })

    it('401 returns failure with unauthorized error', async () => {
        mockFetch(401, {})
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('unauthorized')
    })

    it('403 returns failure with forbidden error', async () => {
        mockFetch(403, {})
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('forbidden')
    })

    it('429 returns failure with rate limit error', async () => {
        mockFetch(429, {})
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('rate limit exceeded')
    })

    it('500 returns failure with unexpected status error', async () => {
        mockFetch(500, {})
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('unexpected status: 500')
    })

    it('bad JSON returns failure with invalid response error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            status: 200,
            json: () => Promise.reject(new SyntaxError('Unexpected token')),
        }))
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('invalid response from server')
    })

    it('network error returns failure with error message', async () => {
        mockFetchError(new Error('Network failure'))
        const client = new ApiAlertsClient('key')
        const result = await client.sendAsync({ message: 'test' })
        expect(result.success).toBe(false)
        expect(result.error).toContain('Network failure')
    })
})

// ── Request headers ───────────────────────────────────────────────────────────

describe('request headers', () => {
    beforeEach(() => mockFetch(200, successBody()))

    it('sends Authorization header', async () => {
        const client = new ApiAlertsClient('my-api-key')
        await client.sendAsync({ message: 'test' })
        expect(capturedHeaders()['authorization']).toBe('Bearer my-api-key')
    })

    it('sends X-Integration and X-Version headers', async () => {
        const client = new ApiAlertsClient('key')
        await client.sendAsync({ message: 'test' })
        expect(capturedHeaders()['x-integration']).toBe('js')
        expect(capturedHeaders()['x-version']).toBe('2.0.0')
    })

    it('setOverrides changes integration headers', async () => {
        const client = new ApiAlertsClient('key')
        client.setOverrides('notify-action', '1.0.0', 'https://api.apialerts.com/event')
        await client.sendAsync({ message: 'test' })
        expect(capturedHeaders()['x-integration']).toBe('notify-action')
        expect(capturedHeaders()['x-version']).toBe('1.0.0')
    })

    it('sendWithKeyAsync uses override key', async () => {
        const client = new ApiAlertsClient('original-key')
        await client.sendWithKeyAsync('override-key', { message: 'test' })
        expect(capturedHeaders()['authorization']).toBe('Bearer override-key')
    })
})

// ── Payload serialization ─────────────────────────────────────────────────────

describe('payload serialization', () => {
    beforeEach(() => mockFetch(200, successBody('W', 'developer')))

    it('serializes all fields', async () => {
        const client = new ApiAlertsClient('key')
        const event: Event = {
            message: 'Full payload',
            channel: 'developer',
            event: 'ci.deploy',
            title: 'Deployed',
            tags: ['CI/CD', 'JS'],
            link: 'https://github.com',
            data: { version: '2.0.0' },
        }
        await client.sendAsync(event)
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
        const client = new ApiAlertsClient('key')
        await client.sendAsync({ message: 'minimal' })
        const body = capturedBody()
        expect(body).not.toHaveProperty('channel')
        expect(body).not.toHaveProperty('event')
        expect(body).not.toHaveProperty('title')
        expect(body).not.toHaveProperty('tags')
        expect(body).not.toHaveProperty('link')
        expect(body).not.toHaveProperty('data')
    })
})

// ── Fire-and-forget ───────────────────────────────────────────────────────────

describe('fire-and-forget send()', () => {
    it('does not throw on HTTP error', () => {
        mockFetch(401, {})
        const client = new ApiAlertsClient('key')
        expect(() => client.send({ message: 'test' })).not.toThrow()
    })

    it('does not throw on empty message', () => {
        const client = new ApiAlertsClient('key')
        expect(() => client.send({ message: '' })).not.toThrow()
    })

    it('does not throw on network error', () => {
        mockFetchError(new Error('Network failure'))
        const client = new ApiAlertsClient('key')
        expect(() => client.send({ message: 'test' })).not.toThrow()
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
