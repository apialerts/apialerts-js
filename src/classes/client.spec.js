import Client from './client.js';
import { integration, version } from './constants.js';

describe('ApiAlerts Client', () => {

    it('should instantiate Client without any errors', () => {
        const client = new Client();
        expect(client).toBeDefined();
    });

    it('should send a message with a valid API key', () => {
        const client = new Client();
        const mockResponse = { workspace: 'Test Workspace', channel: 'General', tags: [], link: null };
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(mockResponse)
            })
        );
        const message = 'Test Message';
        const api_key = 'valid_api_key';
        client.setApiKey(api_key);
        client.send({ message, tags: null, link: null });
        expect(fetch).toHaveBeenCalledWith("https://api.apialerts.com/event", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json',
                'X-Integration': integration,
                'X-Version': version
            },
            body: JSON.stringify({ message, tags: [], link: null, channel: null })
        });
    });

    it('should send a message with a channel', () => {
        const client = new Client();
        const mockResponse = { workspace: 'Test Workspace', channel: 'General', tags: [], link: null };
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(mockResponse)
            })
        );
        const message = 'Test Message';
        const api_key = 'valid_api_key';
        const channel = "test-channel";
        client.setApiKey(api_key);
        client.send({ message, tags: null, link: null, channel: channel });
        expect(fetch).toHaveBeenCalledWith("https://api.apialerts.com/event", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json',
                'X-Integration': integration,
                'X-Version': version
            },
            body: JSON.stringify({ message, tags: [], link: null, channel: channel })
        });
    });

    it('should send a message with a tag', () => {
        const tags = ['tag1', 'tag2', 'tag3'];
        const client = new Client();
        const mockResponse = { workspace: 'Test Workspace', tags, link: null, channel: 'Default' };
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(mockResponse)
            })
        );
        const message = 'Test Message';
        const api_key = 'valid_api_key';
        client.setApiKey(api_key);
        client.send({ message, tags, link: null, channel: null });
        expect(fetch).toHaveBeenCalledWith("https://api.apialerts.com/event", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json',
                'X-Integration': integration,
                'X-Version': version
            },
            body: JSON.stringify({ message, tags, link: null, channel: null })
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

