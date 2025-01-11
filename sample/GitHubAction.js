const client = require('./testClient')

// Parse named parameters: --build, --release, or --publish
const args = process.argv.slice(2)

let eventChannel = "developer"
let eventMessage = "apialerts-js"
let eventTags = null
let eventLink = "https://github.com/apialerts/apialerts-js/actions"

if (args.includes("--build")) {
    eventMessage = "JS - PR build success"
    eventTags = ["CI/CD", "JS", "Build"]
} else if (args.includes("--release")) {
    eventMessage = "JS - Build for publish success"
    eventTags = ["CI/CD", "JS", "Build"]
} else if (args.includes("--publish")) {
    eventChannel = "releases"
    eventMessage = "JS - NPM publish success"
    eventTags = ["CI/CD", "JS", "Deploy"]
}

// send to test client
client.sendAlert({
    channel: eventChannel,
    message: eventMessage,
    tags: eventTags,
    link: eventLink
})