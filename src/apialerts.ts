import { ApiAlertsClient } from './client.js'
import { BASE_URL } from './constants.js'
import type { Event } from './event.js'
import type { SendResult } from './result.js'

let _client: ApiAlertsClient | null = null

export class ApiAlerts {
    static configure(apiKey: string, debug: boolean = false): void {
        if (_client !== null) return
        _client = new ApiAlertsClient(apiKey, debug)
    }

    static setOverrides(integration: string, version: string, baseUrl: string = BASE_URL): void {
        _client?.setOverrides(integration, version, baseUrl)
    }

    static send(event: Event, apiKey?: string): void {
        if (_client === null) {
            console.error('x (apialerts.com) Error: client not configured')
            return
        }
        _client.send(event, apiKey)
    }

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
