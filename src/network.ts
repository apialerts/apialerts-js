import type { Event } from './event.js'
import type { SendResult } from './result.js'
import { INTEGRATION, VERSION, BASE_URL } from './constants.js'

export async function post(
    apiKey: string,
    event: Event,
    integration = INTEGRATION,
    version = VERSION,
    baseUrl = BASE_URL,
): Promise<SendResult> {
    const body: Record<string, unknown> = { message: event.message }
    if (event.channel !== undefined) body.channel = event.channel
    if (event.event !== undefined) body.event = event.event
    if (event.title !== undefined) body.title = event.title
    if (event.tags !== undefined) body.tags = event.tags
    if (event.link !== undefined) body.link = event.link
    if (event.data !== undefined) body.data = event.data

    let response: Response
    try {
        response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-Integration': integration,
                'X-Version': version,
            },
            body: JSON.stringify(body),
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return { success: false, warnings: [], error: message }
    }

    if (response.status !== 200) {
        return { success: false, warnings: [], error: statusError(response.status) }
    }

    let data: unknown
    try {
        data = await response.json()
    } catch {
        return { success: false, warnings: [], error: 'invalid response from server' }
    }

    if (
        typeof data !== 'object' ||
        data === null ||
        !('workspace' in data) ||
        !('channel' in data)
    ) {
        return { success: false, warnings: [], error: 'invalid response from server' }
    }

    const d = data as Record<string, unknown>
    return {
        success: true,
        workspace: String(d.workspace),
        channel: String(d.channel),
        warnings: Array.isArray(d.warnings) ? (d.warnings as string[]) : [],
    }
}

function statusError(status: number): string {
    if (status === 400) return 'bad request'
    if (status === 401) return 'unauthorized — check your API key'
    if (status === 403) return 'forbidden'
    if (status === 429) return 'rate limit exceeded'
    return `unexpected status: ${status}`
}
