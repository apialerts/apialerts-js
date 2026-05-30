export interface Event {
    message: string
    channel?: string
    event?: string
    title?: string
    tags?: string[]
    link?: string
    data?: Record<string, unknown>
}
