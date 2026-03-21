import type { Event } from './event.js'
import { BASE_URL, INTEGRATION, VERSION, post } from './network.js'
import type { SendResult } from './result.js'

export class ApiAlertsClient {
    private readonly apiKey: string
    private integration: string
    private version: string
    private baseUrl: string
    private debug: boolean

    constructor(apiKey: string) {
        this.apiKey = apiKey
        this.integration = INTEGRATION
        this.version = VERSION
        this.baseUrl = BASE_URL
        this.debug = false
    }

    setOverrides(integration: string, version: string, baseUrl: string): void {
        this.integration = integration
        this.version = version
        this.baseUrl = baseUrl
    }

    setDebug(debug: boolean): void {
        this.debug = debug
    }

    send(event: Event): void {
        if (!this.apiKey || !this.apiKey.trim()) {
            console.error('x (apialerts.com) Error: api key is missing')
            return
        }
        if (!event.message || !event.message.trim()) {
            console.error('x (apialerts.com) Error: message is required')
            return
        }
        void (async () => {
            try {
                const result = await post(this.apiKey, event, this.integration, this.version, this.baseUrl)
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
                // fire-and-forget — unexpected errors are swallowed
            }
        })()
    }

    async sendAsync(event: Event): Promise<SendResult> {
        if (!this.apiKey || !this.apiKey.trim()) {
            return { success: false, warnings: [], error: 'api key is missing' }
        }
        if (!event.message || !event.message.trim()) {
            return { success: false, warnings: [], error: 'message is required' }
        }
        try {
            return await post(this.apiKey, event, this.integration, this.version, this.baseUrl)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            return { success: false, warnings: [], error: message }
        }
    }

    async sendWithKeyAsync(apiKey: string, event: Event): Promise<SendResult> {
        if (!apiKey || !apiKey.trim()) {
            return { success: false, warnings: [], error: 'api key is missing' }
        }
        if (!event.message || !event.message.trim()) {
            return { success: false, warnings: [], error: 'message is required' }
        }
        try {
            return await post(apiKey, event, this.integration, this.version, this.baseUrl)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            return { success: false, warnings: [], error: message }
        }
    }
}
