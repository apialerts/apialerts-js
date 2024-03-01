# Magpie - API Alerts

This is a wrapper for the API Alerts service written in JavaScript.

View the API Alerts service at [https://apialerts.com](https://apialerts.com). API Alerts is a service that allows you to send simple alerts (push notifications) to your phone or other devices using a simple API.
  
# Installation 

You will need to download the Magpie/API Alerts app (created by API Alerts) to use the service. Once you have your API keys from there you can proceed!

Download for IOS: [App Store](https://apps.apple.com/us/app/magpie-api-alerts/id6476410789)\
Download for Android: [Play Store](https://play.google.com/store/apps/details?id=com.apialerts) 

After getting your account setup, install the package using npm.

```bash
npm i apialerts-js
```

We recommend you set the following environment variable. The module will use this to authenticate with the API Alerts service without you having to pass it in every time.

```bash
APIALERTS_API_KEY=your_api_key 
```

# Standard Usage

Send a simple message only notification to your devices

```javascript
import alerts from 'apialerts-js';

alerts.send({ message: 'Hello World' })
``` 

# Advanced Usage

Specify a different project in a single request

```javascript
import alerts from 'apialerts-js';

// Pass in the API key as a parameter (Optional)
alerts.send({ message: 'Hello World', api_key: 'your_api_key' })

// Or, set the API key using the setApiKey method before sending the alert
alerts.setApiKey('your_api_key')
alerts.send({ message: 'Hello World' })
``` 

# Optional Properties

You can optionally supply a list of tags and a link to your simple notification.

```javascript
let notification = {
  message: 'Hello World',
  tags: ['tag1', 'tag2'],
  link: 'https://apialerts.com',
  api_key: 'your_api_key'
}
alerts.send(notification)
```

By adding a 'link' property, the app will navigate you to that link when you click on the notification.

# Feedback & Support

If you have any questions or feedback, please create an issue on our GitHub repository. We are always looking to improve our service and would love to hear from you. Thanks for using API Alerts!








