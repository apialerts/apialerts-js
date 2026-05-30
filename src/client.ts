import type { Event } from './event.js'
import { BASE_URL, INTEGRATION, VERSION } from './constants.js'
import { post } from './network.js'
import type { SendResult } from './result.js'

export class ApiAlertsClient {
    private readonly apiKey: string
    private integration: string
    private version: string
    private baseUrl: string
    private debug: boolean

    constructor(apiKey: string, debug: boolean = false) {
        this.apiKey = apiKey
        this.integration = INTEGRATION
        this.version = VERSION
        this.baseUrl = BASE_URL
        this.debug = debug
    }

    setOverrides(integration: string, version: string, baseUrl: string): void {
        this.integration = integration
        this.version = version
        this.baseUrl = baseUrl
    }

    setDebug(debug: boolean): void {
        this.debug = debug
    }

    send(event: Event, apiKey?: string): void {
        const key = apiKey?.trim() ? apiKey : this.apiKey
        if (!key || !key.trim()) {
            console.error('x (apialerts.com) Error: api key is missing')
            return
        }
        if (!event.message || !event.message.trim()) {
            console.error('x (apialerts.com) Error: message is required')
            return
        }
        void (async () => {
            try {
                const result = await post(key, event, this.integration, this.version, this.baseUrl)
                if (!this.debug) return
                if (!result.success) {
                    console.error(`x (apialerts.com) Error: ${result.error}`)
                } else {
                    console.log(`✓ (apialerts.com) Alert sent to ${result.workspace} (${result.channel})`)
                    for (const w of result.warnings) {
                        console.warn(`! (apialerts.com) Warning: ${w}`)
                    }
                }
            } catch {
                // fire-and-forget - unexpected errors are swallowed
            }
        })()
    }

    async sendAsync(event: Event, apiKey?: string): Promise<SendResult> {
        const key = apiKey?.trim() ? apiKey : this.apiKey
        if (!key || !key.trim()) {
            return { success: false, warnings: [], error: 'api key is missing' }
        }
        if (!event.message || !event.message.trim()) {
            return { success: false, warnings: [], error: 'message is required' }
        }
        try {
            return await post(key, event, this.integration, this.version, this.baseUrl)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            return { success: false, warnings: [], error: message }
        }
    }
}
