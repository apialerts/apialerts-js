/**
 * Client class
 */
declare class Client {
    constructor()

    /**
     * Set API key
     * @param url 
     */
    setApiKey(url: string): void


    /**
     * Send a message to the server
     * @param message 
     */
    send({
        message,
        api_key
    }: {
        message: string
        api_key?: string
    }): void
}

/**
 * Export the client
 */
declare const client: Client
export = client
export { Client }