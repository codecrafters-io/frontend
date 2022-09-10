# codecrafters-frontend

The front-end app that is served by [codecrafters-io/server](https://github.com/codecrafters-io/server).

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://cli.emberjs.com/release/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd codecrafters-frontend`
* `npm install`

## Running / Development

* `ember serve`
* View your app via https://codecrafters

## Running tests

- `ember test --server` (will launch a Chrome instance that'll run your tests)

### Linting

* `npm run lint`
* `npm run lint:fix`

### Deploying

- This app is served via [codecrafters-io/server](https://github.com/codecrafters-io/server)
- When a commit is merged into master, GitHub Actions will create a corresponding PR [like this](https://github.com/codecrafters-io/server/pull/39).
- Merge that PR, and the app will be deployed.
- It can take 2-3 minutes for the PR to be created.
