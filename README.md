# apialerts-js

Javascript client for the [apialerts.com](https://apialerts.com/) platform

[Docs](https://apialerts.com/docs/js) • [GitHub](https://github.com/apialerts/apialerts-js) • [NPM](https://www.npmjs.com/package/apialerts-js)

This is a wrapper for the API Alerts service written in JavaScript.
  
### Installation 

Install the package using NPM

```bash
npm i apialerts-js
```

### Standard Usage

We recommend you set the following environment variable. The module will use this to authenticate with the API Alerts service without you having to pass it in every time.

```bash
APIALERTS_API_KEY=your_api_key 
```

Send a simple message only notification to your devices

```javascript
import alerts from 'apialerts-js';

alerts.send({ message: 'Hello World' })
``` 

### Advanced Usage

Specify a different workspace in a single request

```javascript
import alerts from 'apialerts-js';

// Pass in the API key as a parameter (Optional)
// Pass in the workspace channel identifier. (Optional - Uses the default channel if not set)
alerts.send({ message: 'Hello World', api_key: 'your_api_key',  channel: 'integration' })

// Or, set a new API key using the setApiKey method before sending the alert
alerts.setApiKey('your_api_key')
alerts.send({ message: 'Hello World', channel: 'integration' })
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

### Feedback & Support

If you have any questions or feedback, please create an issue on our GitHub repository. We are always looking to improve our service and would love to hear from you. Thanks for using API Alerts!

### Release Process

1. Update the version in src/classes/constants.js
2. Update the version in `package.json`
3. run `npm install`
4. PR to main `branch`
5. Create a new release on GitHub on Main
6. GitHub Actions will publish to NPM
