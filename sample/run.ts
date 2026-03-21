/**
 * Integration test sample — requires APIALERTS_API_KEY env var.
 * Run with: npx tsx sample/run.ts
 */
import { ApiAlerts } from '../src/index.js'

const apiKey = process.env.APIALERTS_API_KEY ?? ''
if (!apiKey) {
    console.error('Error: APIALERTS_API_KEY environment variable is not set')
    process.exit(1)
}

ApiAlerts.configure(apiKey)

// Minimal — message only
const r1 = await ApiAlerts.sendAsync({ message: 'JS SDK - minimal' })
if (!r1.success) {
    console.error(`x (apialerts.com) Error: ${r1.error}`)
    process.exit(1)
} else {
    console.log(`✓ (apialerts.com) Alert sent to ${r1.workspace} (${r1.channel})`)
    for (const w of r1.warnings) {
        console.warn(`! (apialerts.com) Warning: ${w}`)
    }
}

// Full — all fields
const r2 = await ApiAlerts.sendAsync({
    message: 'JS SDK - full',
    channel: 'developer',
    event: 'sdk.test',
    title: 'Integration Test',
    tags: ['CI/CD', 'JS'],
    link: 'https://github.com/apialerts/apialerts-js/actions',
    data: { version: '2.0.0' },
})
if (!r2.success) {
    console.error(`x (apialerts.com) Error: ${r2.error}`)
    process.exit(1)
} else {
    console.log(`✓ (apialerts.com) Alert sent to ${r2.workspace} (${r2.channel})`)
    for (const w of r2.warnings) {
        console.warn(`! (apialerts.com) Warning: ${w}`)
    }
}
