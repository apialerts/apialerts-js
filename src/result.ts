export interface SendResult {
    success: boolean
    workspace?: string
    channel?: string
    warnings: string[]
    error?: string
}
