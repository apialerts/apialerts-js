const client = require('./testClient')

// Parse named parameters: message, tags, link
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
    const [key, value] = arg.split('=');
    params[key.replace('--', '')] = value;
});

// build event payload
let event =  {
    message: params.message || 'apialerts-js',
    tags: params.tags?.split(',') || null,
    link: params.link || null
}

// send to test client
client.sendAlert(event)