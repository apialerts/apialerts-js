const client = require('./testClient')

// Parse named parameters: channel, message, tags, link
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
    const [key, value] = arg.split('=');
    params[key.replace('--', '')] = value;
});

// build event payload
let event =  {
    channel: params.channel,
    message: params.message ?? 'apialerts-js',
    tags: params.tags?.split(','),
    link: params.link
}

// send to test client
client.sendAlert(event)