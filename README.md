# SlabGuardz Storefront

SlabGuardz is a React, TypeScript, and Vite single-page ecommerce application. Product and cart data use the existing Hostinger Ecommerce Custom Sales Channel.

## Local setup

Use Node.js 22.12 or newer:

```sh
npm install
npm run dev
```

## Production build

Set the required Vite environment variables before building. Use `.env.example` as the safe template and keep real values in an ignored `.env` file locally or in Hostinger's build environment.

```sh
npm install
npm run build
```

The production build command is `npm run build` (`tsc -b && vite build`). Vite writes the deployable static site to `dist/`.

Required build-time environment variable names:

- `VITE_HOSTINGER_ECOMMERCE_API_URL`
- `VITE_HOSTINGER_SALES_CHANNEL_ID`

These `VITE_` values are included in the browser bundle. Do not put API secrets, cart tokens, payment credentials, email private keys, or other private credentials in Vite variables.

## Hostinger deployment

1. Connect the existing GitHub repository using Hostinger's Git deployment option. Keep the existing Hostinger store and Custom Sales Channel configuration.
2. Use Node.js 22.12 or newer, install with `npm install`, build with `npm run build`, and publish the `dist/` directory.
3. Provide the two required `VITE_` variables in the deployment's build environment, using the existing Sales Channel ID. Vite reads these during the build, so setting them only at runtime is not sufficient.
4. `public/.htaccess` is copied into `dist/` and provides an Apache rewrite to `index.html` for React Router deep links. If the selected Hostinger deployment target does not use Apache, configure its equivalent SPA fallback so unknown file paths serve `index.html`.
5. Connect `slabguardz.in` and enable HTTPS in Hostinger's domain/SSL settings. No production hostname is hardcoded in the app.

Do not commit `.env` files, credentials, `node_modules/`, or `dist/`. `.gitignore` excludes them; `.env.example` contains only safe placeholders.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
