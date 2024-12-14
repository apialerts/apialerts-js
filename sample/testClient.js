const Client = require('../src/classes/client');

// use an environment variable to store the API Key
const apiKey = process.env.APIALERTS_API_KEY;

if (!apiKey) {
    // throw an error if the API Key is not set
    throw new Error('API Key is required')
}

function sendAlert(event) {
    const client = new Client();
    client.setApiKey(apiKey)

    // Not catching error here only in GitHub Actions so it can fail pipeline
    client.send(event)
}

module.exports = { sendAlert }