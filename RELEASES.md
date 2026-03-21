# Release Process

## Files to update

1. `src/constants.ts` — update `VERSION` constant
2. `package.json` — update `version` field
3. Run `npm install` to sync `package-lock.json`
4. PR to `main`

## Alpha release

Use this to test before publishing to `latest`.

1. Set version to `x.y.z-alpha.N` (e.g. `1.3.1-alpha.1`) in both files above
2. Create a GitHub release tagged `x.y.z-alpha.N`, **check "Set as pre-release"**
3. GitHub Actions runs the `publish-alpha` job: `npm publish --tag alpha`
4. Install with `npm install apialerts@alpha` — does **not** affect `npm install apialerts`

## Full release

1. Set version to `x.y.z` in both files above
2. Create a GitHub release tagged `x.y.z`, **uncheck "Set as pre-release"**
3. GitHub Actions runs the `publish-release` job: `npm publish --provenance --access public`
4. Becomes the new `latest` — `npm install apialerts` picks it up

## Checking npm tags

```bash
npm dist-tag ls apialerts
```
