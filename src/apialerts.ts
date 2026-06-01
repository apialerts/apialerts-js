import { ApiAlertsClient } from './client.js'
import { BASE_URL } from './constants.js'
import type { Event } from './event.js'
import type { SendResult } from './result.js'

let _client: ApiAlertsClient | null = null

/**
 * Global API Alerts singleton. Call `configure` once at startup, then call
 * `send` / `sendAsync` anywhere in your codebase. There is no public instance
 * client - this static surface is the entire SDK API.
 */
export class ApiAlerts {
    /**
     * Initialise the singleton with your workspace API key. The first call
     * wins; subsequent calls are no-ops, so configure once at startup.
     *
     * @param apiKey - Workspace API key (Bearer token sent on every request).
     * @param debug - When true, success / warning / error messages log to the
     *   console via `console.log` / `console.warn` / `console.error`.
     *   Critical errors (missing key, not configured) always log regardless.
     */
    static configure(apiKey: string, debug: boolean = false): void {
        if (_client !== null) return
        _client = new ApiAlertsClient(apiKey, debug)
    }

    /**
     * Override the X-Integration / X-Version headers and the base URL.
     *
     * For wrapper libraries that build on top of this SDK to identify
     * themselves (e.g. a middleware tagging itself as `express-apialerts`).
     * If a wrapper misbehaves we can tell which library is responsible and
     * report it back to its maintainer. Also used in tests to redirect at a
     * mock server. Must be called after `configure`.
     */
    static setOverrides(integration: string, version: string, baseUrl: string = BASE_URL): void {
        _client?.setOverrides(integration, version, baseUrl)
    }

    /**
     * Fire-and-forget delivery. Returns immediately; the HTTP request runs in
     * the background. Never throws - errors are silently dropped (or logged
     * when `debug` is enabled). Use {@link sendAsync} when you need to inspect
     * the result.
     *
     * @param event - The event to deliver. Only `message` is required.
     * @param apiKey - Optional one-shot override of the configured key. Useful
     *   for sending to multiple workspaces from the same process.
     */
    static send(event: Event, apiKey?: string): void {
        if (_client === null) {
            console.error('x (apialerts.com) Error: client not configured')
            return
        }
        _client.send(event, apiKey)
    }

    /**
     * Awaitable delivery. Never throws - inspect `result.success` to branch
     * on outcome, then read `result.workspace` / `result.channel` on success
     * or `result.error` on failure.
     *
     * @param event - The event to deliver. Only `message` is required.
     * @param apiKey - Optional one-shot override of the configured key. Useful
     *   for sending to multiple workspaces from the same process.
     * @returns A {@link SendResult} - never a rejected promise.
     */
    static async sendAsync(event: Event, apiKey?: string): Promise<SendResult> {
        if (_client === null) {
            return { success: false, warnings: [], error: 'client not configured' }
        }
        return _client.sendAsync(event, apiKey)
    }

    /** @internal - for tests only */
    static _reset(): void {
        _client = null
    }
}
