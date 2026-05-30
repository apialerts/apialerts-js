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

### Global singleton (recommended)

Call `configure` once at startup, then use `send` / `sendAsync` anywhere.

```typescript
import { ApiAlerts } from 'apialerts'

ApiAlerts.configure('your-api-key')

// Fire-and-forget — never throws
ApiAlerts.send({ message: 'Deploy complete' })

// Or get the result back — never throws
const result = await ApiAlerts.sendAsync({ message: 'Deploy complete' })
if (!result.success) {
  console.error(result.error)
} else {
  console.log(`Sent to ${result.workspace} (${result.channel})`)
}
```

### Event fields

Only `message` is required. All other fields are optional.

```typescript
import { ApiAlerts, type Event } from 'apialerts'

const event: Event = {
  message: 'Deploy complete',
  channel: 'releases',
  event:   'ci.deploy',
  title:   'Deployed',
  tags:    ['CI/CD', 'JS'],
  link:    'https://github.com/apialerts/apialerts-js/actions',
  data:    { version: '1.3.0' },
}

const result = await ApiAlerts.sendAsync(event)
if (!result.success) {
  console.error(result.error)
}
```

| Field     | Type                        | Required | Description                      |
|-----------|-----------------------------|----------|----------------------------------|
| `message` | `string`                    | Yes      | Main notification message        |
| `channel` | `string`                    | No       | Target channel name              |
| `event`   | `string`                    | No       | Event key (e.g. `ci.deploy`)     |
| `title`   | `string`                    | No       | Short title                      |
| `tags`    | `string[]`                  | No       | Categorisation tags              |
| `link`    | `string`                    | No       | URL attached to the notification |
| `data`    | `Record<string, unknown>`   | No       | Arbitrary key-value metadata     |

### Instance-based client

Use `ApiAlertsClient` directly when you need multiple clients or full
lifecycle control.

```typescript
import { ApiAlertsClient } from 'apialerts'

const client = new ApiAlertsClient('your-api-key')
const result = await client.sendAsync({ message: 'Deploy complete' })
if (!result.success) {
  console.error(result.error)
} else {
  console.log(`Sent to ${result.workspace} (${result.channel})`)
}
```

### Send to multiple workspaces

```typescript
const result = await ApiAlerts.sendWithKeyAsync('other-api-key', { message: 'Deploy complete' })
if (!result.success) {
  console.error(result.error)
}
```

## Links

- [Documentation](https://apialerts.com/docs)
- [Sign up](https://apialerts.com)
- [GitHub Issues](https://github.com/apialerts/apialerts-js/issues)
