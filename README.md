# codecrafters-frontend

The front-end app that powers [app.codecrafters.io](https://app.codecrafters.io).

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

You can run tests locally without a backend server, but to use the app you'll also need an instance of
[codecrafters-io/core](https://github.com/codecrafters-io/core) running. You can either run this against staging,
or against a local instance of `core`. Visit the `core` repo for setup instructions.

## Setup / Installation

- `git clone <repository-url>` this repository
- `cd frontend`
- `npm install`
- Copy `.env.example` to `.env` and fill in the values

## Running / Development

- `npm run start`
- View your app via https://<username>.ccdev.dev

## Running against staging

- Run `BACKEND_URL="https://backend-staging.codecrafters.io" npm run start`
- View your app at http://localhost:4200

## Running with or without FastBoot

- FastBoot is **enabled** when running `ember build --environment=production`
  - Pre-rendering is done only for routes configured under `prember` section in `ember-cli-build.js`
- FastBoot is **enabled for all routes** when running `ember server`
  - To disable it, run `FASTBOOT_DISABLED=true ember server` 
  - Alternatively, append `?fastboot=false` query parameter to each request URL
- Add `FASTBOOT_DISABLED=true` to your local `.env` file to disable FastBoot completely
  - You can override it by passing `FASTBOOT_DISABLED=""` in the command line
- NPM tasks `start` and `start:ember` run with FastBoot **disabled**
- NPM tasks `start:fastboot` and `start:ember:fastboot` run with FastBoot **enabled**

## Running tests

- `ember test --server` (will launch a Chrome instance that'll run your tests)

### Linting

- `npm run lint`
- `npm run lint:fix`

### Analyzing bundle size

- Run `ANALYZE_BUNDLE=true ember server --environment=production`

### Deploying

- This app is automatically deployed to [app.codecrafters.io](https://app.codecrafters.io) when a commit is merged into master.
- Each branch is also deployed to a preview URL via Vercel.
