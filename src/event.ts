/**
 * A single notification dispatched to API Alerts. `message` is the only
 * required field. Everything else is optional and omitted from the request
 * body when undefined.
 */
export interface Event {
    /**
     * Required. Human-readable notification text. Used as the push notification message.
     */
    message: string

    /**
     * Optional. Selects which workspace channel the push notification fires on.
     * Defaults to the workspace default channel.
     */
    channel?: string

    /**
     * Optional but recommended. Used in event routing rules.
     * Recommend using dot notation (e.g. `ci.deploy.success`, `payment.failed`, `user.signup`)
     * so routing rules can match glob patterns like `ci.*` or `*.failed`.
     */
    event?: string

    /**
     * Optional. Short headline some destinations render separately from the message body.
     */
    title?: string

    /**
     * Optional. Categorization tags for filtering and search.
     */
    tags?: string[]

    /**
     * Optional. URL attached to the notification. Useful as a deeplink for the push notification or
     * callout buttons in routed destinations
     */
    link?: string

    /**
     * Optional. Any JSON object of key-value metadata. Available to non-push destinations for event
     * templating (Slack message bodies, email templates, webhook payloads).
     */
    data?: Record<string, unknown>
}
