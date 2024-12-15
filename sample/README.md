# Sample

These quick scripts are used in the GitHub action workflows to send events to ApiAlerts using the library code. This is to ensure the library code is good to deploy with the latest changes.

From terminal, run the command supplying optional message, link and tags
```
APIALERTS_API_KEY=your-api-key node sample/GitHubAction.js --build
```