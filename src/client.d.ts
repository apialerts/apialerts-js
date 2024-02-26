/**
 * Client class
 */
declare class Client {
    constructor()

    /**
     * Set API key
     * @param api_key
     */
    setApiKey(api_key: string): void


    /**
     * Send a message to the server
     * @param message message to send
     * @param tags optional list of tags (i.e. ['Tag1', 'Tag2'])
     * @param link optional link (i.e. https://google.com)
     * @param api_key optional override for the default api key
     */
    send({
        message,
        tags,
        link,
        api_key
    }: {
        message: string
        tags?: string[]
        link?: string | null
        api_key?: string
    }): void
}

/**
 * Export the client
 */
declare const client: Client
export = client
export { Client }