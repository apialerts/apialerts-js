const client = require('./testClient')

// Parse named parameters: --build, --release, or --publish
const args = process.argv.slice(2)

let eventChannel = "developer"
let eventMessage = "apialerts-js"
let eventTags = null
let eventLink = "https://github.com/apialerts/apialerts-js/actions"

if (args.includes("--build")) {
    eventMessage = "Javascript - PR build success"
    eventTags = ["Library", "Javascript", "CI/CD", "Build"]
} else if (args.includes("--release")) {
    eventMessage = "Javascript - Build for publish success"
    eventTags = ["Library", "Javascript", "CI/CD", "Build"]
} else if (args.includes("--publish")) {
    eventChannel = "releases"
    eventMessage = "Javascript - NPM publish success"
    eventTags = ["Library", "Javascript", "CI/CD", "Deploy"]
}

// send to test client
client.sendAlert({
    channel: eventChannel,
    message: eventMessage,
    tags: eventTags,
    link: eventLink
})