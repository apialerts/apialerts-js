const Client = require('./client');

describe('ApiAlerts Client', () => {

    it('should instantiate Client without any errors', () => {
        const client = new Client();
        expect(client).toBeDefined();
    });

    it('should send a message with a valid API key', () => {
        const client = new Client();
        const mockResponse = { project: 'Test Project' };
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(mockResponse)
            })
        );
        const message = 'Test Message';
        const api_key = 'valid_api_key';
        client.setApiKey(api_key);
        client.send({ message });
        expect(fetch).toHaveBeenCalledWith("https://api.apialerts.com/event", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
    });

    it('should throw an error when sending a message without an API key', () => {
        const client = new Client();
        const message = 'Test Message';
        expect(() => {
            client.send({ message });
        }).toThrow('API Key is required');
    });

    it('should throw an error when sending a message without a message', () => {
        const client = new Client();
        const api_key = 'valid_api_key';
        client.setApiKey(api_key);
        expect(() => {
            client.send({ api_key });
        }).toThrow('Message is required');
    });
});

