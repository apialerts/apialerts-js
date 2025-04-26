# API Alerts • JS Client

[GitHub Repo](https://github.com/apialerts/apialerts-js) • [NPM](https://www.npmjs.com/package/apialerts-js)

This library is compatible with Node.js and popular front-end frameworks like React, Angular, and Vue.js.
  
### Installation 

Install the package using NPM

```bash
npm i apialerts-js
```

### Standard Usage

We recommend calling alerts.setApiKey at the start of your application. The module will use this to authenticate with the API Alerts service without you having to pass it in every time.

```bash
import alerts from 'apialerts-js';

// Set the default API key using the setApiKey method before sending alerts
alerts.setApiKey('your_api_key')

// Send a simple message only notification to your workspace
alerts.send({ message: 'Hello World', channel: 'general' })
```

### Advanced Usage

Specify a different workspace for a single request

```javascript
import alerts from 'apialerts-js';

// Pass in the API key as a parameter (Optional)
// Pass in the workspace channel identifier. (Optional - Uses the default channel if not set)
alerts.send({ message: 'Hello World', api_key: 'your_api_key', channel: 'general' })

// Or, set a new API key using the setApiKey method before sending the alert
alerts.setApiKey('your_api_key')
alerts.send({ message: 'Hello World', channel: 'general' })
``` 

### Optional Properties

You can optionally supply a list of tags and a link to your simple notification.

```javascript
let notification = {
  channel: 'integration',         // Optional, uses the default channel if not set
  message: 'Hello World',         // Required
  tags: ['tag1', 'tag2'],         // Optional
  link: 'https://apialerts.com',  // Optional
  api_key: 'your_api_key',        // Optional, uses the key from setApiKey() if not provided
}
alerts.send(notification)
```
