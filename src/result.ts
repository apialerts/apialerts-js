/**
 * The outcome of a `sendAsync` call. `sendAsync` never throws - inspect
 * `success` to branch on delivery, then read `workspace` / `channel` on
 * success or `error` on failure.
 */
export interface SendResult {
    /** `true` if the event was delivered to API Alerts. */
    success: boolean

    /** Workspace name returned by the server. Populated on success. */
    workspace?: string

    /** Channel the event landed on. Populated on success. */
    channel?: string

    /** Non-fatal warnings returned by the server (e.g. deprecated field usage). */
    warnings: string[]

    /** Human-readable error message. Populated on failure. */
    error?: string
}
