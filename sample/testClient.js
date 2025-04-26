import alerts from '../src/client.js';

// Reference the environment variable storing the API Key
const apiKey = process.env.APIALERTS_API_KEY;

if (!apiKey) {
    // throw an error if the API Key is not set
    throw new Error('API Key is required')
}

// Set the API Key
alerts.setApiKey(apiKey)

export function sendAlert({
   message,
   tags = undefined,
   link = undefined,
   apiKey = this.apiKey,
   channel = undefined,
}) {
    alerts.send({
        message: message,
        tags: tags,
        link: link,
        api_key: apiKey,
        channel: channel
    })
}
