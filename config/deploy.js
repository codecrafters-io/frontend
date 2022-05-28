'use strict';

const deployBranch = require('./deploy-branch');
const deployDevelopment = require('./deploy-development');
const deployVersion = require('./deploy-version');

if (process.env.EMBER_DEPLOY_APP_BRANCH) {
  module.exports = deployBranch;
} else if (process.env.EMBER_DEPLOY_APP_VERSION) {
  module.exports = deployVersion;
} else {
  module.exports = deployDevelopment;
}
