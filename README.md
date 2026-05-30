# API Alerts • JS/TS Client

[![npm](https://img.shields.io/npm/v/apialerts)](https://www.npmjs.com/package/apialerts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[npm](https://www.npmjs.com/package/apialerts) • [GitHub](https://github.com/apialerts/apialerts-js) • [API Alerts](https://apialerts.com)

Effortless project notifications. Send once, deliver everywhere.

Compatible with Node.js, Deno, Bun, and browser environments. Full TypeScript support.

## Installation

```bash
npm install apialerts
```

## Quick Start

```typescript
import { ApiAlerts } from 'apialerts'

ApiAlerts.configure('your-api-key')
ApiAlerts.send({ message: 'Deploy complete' })
```

## Usage

### Global singleton

Call `configure` once at startup, then use `send` / `sendAsync` anywhere.

```typescript
import { ApiAlerts } from 'apialerts'

ApiAlerts.configure('your-api-key')

// Fire-and-forget. Never throws, silently drops errors.
// Pass `debug: true` to `configure` to log them.
ApiAlerts.send({ message: 'Deploy complete' })

// Or get the result back. Never throws, check `result.success`.
const result = await ApiAlerts.sendAsync({ message: 'Deploy complete' })
if (!result.success) {
  console.error(result.error)
} else {
  console.log(`Sent to ${result.workspace} (${result.channel})`)
}
```

### Enable debug logging

```typescript
ApiAlerts.configure('your-api-key', true) // logs successes, warnings, and errors
```

When debug is enabled, the SDK logs `✓` for successful sends, `!` for warnings, and `x` for errors. Critical errors (missing API key, not yet configured) always log regardless.

### Event fields

Only `message` is required. All other fields are optional and omitted from the request body when not set.

```typescript
import { ApiAlerts, type Event } from 'apialerts'

const event: Event = {
  message: 'Deploy complete',
  channel: 'releases',
  event:   'ci.deploy.success',
  title:   'Deployed',
  tags:    ['CI/CD', 'JS'],
  link:    'https://github.com/apialerts/apialerts-js/actions',
  data:    { version: '1.3.2' },
}

const result = await ApiAlerts.sendAsync(event)
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | `string` | Yes | Human-readable notification text. This is what appears on the push notification lock screen. |
| `channel` | `string` | No | Workspace channel the push notification fires on. Defaults to the workspace default channel when omitted. |
| `event` | `string` | No | Identifies what kind of thing happened. Optional but recommended. Use dotted notation (e.g. `ci.deploy.success`, `payment.failed`, `user.signup`) so routing rules can match glob patterns like `ci.*` or `*.failed`. |
| `title` | `string` | No | Short headline some destinations render separately from the message body. |
| `tags` | `string[]` | No | Categorisation tags for filtering and search. |
| `link` | `string` | No | URL attached to the notification. Tapping the push notification opens this link. |
| `data` | `Record<string, unknown>` | No | Arbitrary key-value metadata. Available to non-push destinations for templating (Slack message bodies, email templates, webhook payloads). |

### Send to multiple workspaces

Pass an `apiKey` as the optional second argument to override the configured key for one call.

```typescript
ApiAlerts.send({ message: 'Deploy complete' }, 'other-workspace-api-key')

const result = await ApiAlerts.sendAsync(
  { message: 'Deploy complete' },
  'other-workspace-api-key',
)
```

## API

| Method | Description |
|---|---|
| `ApiAlerts.configure(apiKey, debug?)` | Initialise the singleton. First call wins; subsequent calls are no-ops. |
| `ApiAlerts.send(event, apiKey?)` | Fire-and-forget. Never throws, drops errors silently unless `debug` is on. |
| `ApiAlerts.sendAsync(event, apiKey?)` | Returns a `SendResult`. Never throws; check `result.success`. |

`SendResult` shape:

```typescript
interface SendResult {
  success: boolean
  workspace?: string  // populated on success
  channel?: string    // populated on success
  warnings: string[]  // non-fatal server warnings (e.g. deprecated field)
  error?: string      // populated on failure
}
```

## Links

- [Documentation](https://apialerts.com/docs)
- [Sign up](https://apialerts.com)
- [GitHub Issues](https://github.com/apialerts/apialerts-js/issues)
