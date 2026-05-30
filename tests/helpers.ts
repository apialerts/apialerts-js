import { vi } from 'vitest'

export function mockFetch(status: number, body: unknown): void {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        status,
        json: () => Promise.resolve(body),
    }))
}

export function mockFetchError(error: Error): void {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error))
}

export function successBody(workspace = 'My Workspace', channel = 'general', warnings: string[] = []) {
    return { workspace, channel, warnings }
}

export function capturedOptions(): RequestInit {
    return (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit
}

export function capturedBody(): Record<string, unknown> {
    return JSON.parse(capturedOptions().body as string)
}

export function capturedHeaders(): Record<string, string> {
    const raw = capturedOptions().headers as Record<string, string>
    const headers: Record<string, string> = {}
    for (const [k, v] of Object.entries(raw)) {
        headers[k.toLowerCase()] = v
    }
    return headers
}
