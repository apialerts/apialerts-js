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
     * @param channel optional workspace channel to send message to
     */
    send({
        message,
        tags,
        link,
        api_key,
        channel
    }: {
        message: string
        tags?: string[] | null
        link?: string | null
        api_key?: string | null
        channel?: string | null
    }): void
}

/**
 * Export the client
 */
declare const client: Client
// @ts-ignore
export = client
export { Client }