/**
 * Integration test sample — requires APIALERTS_API_KEY env var.
 * Run with: npx tsx sample/run.ts [--build | --release | --publish | --integration-tests [--channel <name>]]
 */
import { ApiAlerts } from '../src/index.js'

const apiKey = process.env.APIALERTS_API_KEY ?? ''
if (!apiKey) {
    console.error('Error: APIALERTS_API_KEY environment variable is not set')
    process.exit(1)
}

const isBuild            = process.argv.includes('--build')
const isRelease          = process.argv.includes('--release')
const isPublish          = process.argv.includes('--publish')
const isIntegrationTests = process.argv.includes('--integration-tests')

const channelIdx = process.argv.indexOf('--channel')
const channel = channelIdx >= 0 ? (process.argv[channelIdx + 1] ?? 'testing') : 'testing'

const link = 'https://github.com/apialerts/apialerts-js/actions'

ApiAlerts.configure(apiKey)

if (isBuild) {
    const result = await ApiAlerts.sendAsync({
        channel: 'developer',
        event: 'ci.build',
        title: 'Build Passed',
        message: 'JS SDK - PR build success',
        tags: ['CI/CD', 'JS', 'Build'],
        link,
    })
    if (!result.success) {
        console.error(`Error: ${result.error}`)
        process.exit(1)
    }
    console.log(`✓ Sent to ${result.workspace} (${result.channel})`)

} else if (isRelease) {
    const result = await ApiAlerts.sendAsync({
        channel: 'developer',
        event: 'ci.release',
        title: 'Release Build Passed',
        message: 'JS SDK - Build for publish success',
        tags: ['CI/CD', 'JS', 'Build'],
        link,
    })
    if (!result.success) {
        console.error(`Error: ${result.error}`)
        process.exit(1)
    }
    console.log(`✓ Sent to ${result.workspace} (${result.channel})`)

} else if (isPublish) {
    const result = await ApiAlerts.sendAsync({
        channel: 'releases',
        event: 'ci.publish',
        title: 'Published',
        message: 'JS SDK - npm publish success',
        tags: ['CI/CD', 'JS', 'Deploy'],
        link,
    })
    if (!result.success) {
        console.error(`Error: ${result.error}`)
        process.exit(1)
    }
    console.log(`✓ Sent to ${result.workspace} (${result.channel})`)

} else if (isIntegrationTests) {
    const r1 = await ApiAlerts.sendAsync({ message: 'JS SDK - minimal', channel })
    if (!r1.success) {
        console.error(`Error (minimal): ${r1.error}`)
        process.exit(1)
    }
    console.log(`✓ sent to ${r1.workspace} (${r1.channel})`)

    const r2 = await ApiAlerts.sendAsync({
        message: 'JS SDK - full',
        channel,
        event: 'sdk.test',
        title: 'Integration Test',
        tags: ['CI/CD', 'JS'],
        link,
        data: { version: '2.0.0' },
    })
    if (!r2.success) {
        console.error(`Error (full): ${r2.error}`)
        process.exit(1)
    }
    console.log(`✓ sent to ${r2.workspace} (${r2.channel})`)
    for (const w of r2.warnings) {
        console.warn(`! Warning: ${w}`)
    }
} else {
    console.error('Error: pass --build, --release, --publish, or --integration-tests')
    process.exit(1)
}
