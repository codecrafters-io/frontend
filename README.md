# codecrafters-frontend

The frontend app that powers [app.codecrafters.io](https://app.codecrafters.io).

## Prerequisites

You will need the following things installed on your computer:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

You can run tests locally without a backend server. To use the app, point it at staging or a local
instance of [codecrafters-io/core](https://github.com/codecrafters-io/core). Visit the `core` repo to run the backend locally.

## Setup / Installation

- `git clone <repository-url>` this repository
- `cd frontend`
- `bun install`
- Copy `.env.example` to `.env` and fill in the values

## Running / Development

- `make serve`
- Visit your app at [https://<username>.ccdev.dev](https://<username>.ccdev.dev).
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

## Running against staging

`.env.example` already points at staging, so `make serve` uses it after you copy that file to `.env`.

- `BACKEND_URL` is `https://backend-staging.codecrafters.io`
- Open http://localhost:4200
- Click **Log in**. The app sends you to the staging backend, then GitHub, then back to localhost with a `session_token`.
- The app stores that token in `localStorage` (`session_token_v1`) and loads your staging account.
- A first-time GitHub account is sent to `/welcome` before the page you were on.

To point at staging without editing `.env`:

- Run `BACKEND_URL="https://backend-staging.codecrafters.io" bun run start`

## Running with or without FastBoot

- FastBoot is **enabled** when running `ember build --environment=production`
  - Pre-rendering is done only for routes configured under `prember` section in `ember-cli-build.js`
- FastBoot is **enabled for all routes** when running `ember server`
  - To disable it, run `FASTBOOT_DISABLED=true ember server`
  - Alternatively, append `?fastboot=false` query parameter to each request URL
- Add `FASTBOOT_DISABLED=true` to your local `.env` file to disable FastBoot completely
  - You can override it by passing `FASTBOOT_DISABLED=""` in the command line
- Script `start` runs with FastBoot **disabled**
- Script `start:fastboot` runs with FastBoot **enabled**

## Running tests

- Run `make serve`, ensure your server is running
- View your tests at [http://localhost:4200/tests/index/html?moduleId=abcd](http://localhost:4200/tests/index.html?moduleId=abcd).
- Select the module(s) you want to run from the dropdown at the top right of the page & click "Apply" to run tests.
- To run all tests, remove the `?moduleId=abcd` query parameter from the URL.

### Linting

- `bun run lint`
- `bun run lint:fix`

### Inspecting ESLint configuration

- Run `bun run inspect:eslint`

### Analyzing bundle size

- Run `ANALYZE_BUNDLE=true ember server --environment=production`

### Building

- `bunx ember build` (development)
- `bun run build` (production)

### Deploying

- This app is automatically deployed to [app.codecrafters.io](https://app.codecrafters.io) when a commit is merged into main.
- Each branch is also deployed to a preview URL via Vercel.
