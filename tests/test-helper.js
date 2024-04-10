import Application from 'codecrafters-frontend/app';
import config from 'codecrafters-frontend/config/environment';
import * as QUnit from 'qunit';
import { forceModulesToBeLoaded, sendCoverage } from 'ember-cli-code-coverage/test-support';
import { setApplication } from '@ember/test-helpers';
import { setup as setupQunitDom } from 'qunit-dom';
import { setup as setupQunitAssertionsExtra } from 'qunit-assertions-extra';

import start from 'ember-exam/test-support/start';
// import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

setupQunitDom(QUnit.assert);
setupQunitAssertionsExtra(QUnit.assert);

QUnit.testStart(function () {
  window.localStorage.clear(); // We use localStorage for session tokens
});

QUnit.done(async function () {
  forceModulesToBeLoaded((type, moduleName) => {
    if (moduleName === 'codecrafters-frontend/tailwind.config') {
      return false;
    }

    if (moduleName.startsWith('codecrafters-frontend/tests')) {
      return false;
    } else if (moduleName.startsWith('codecrafters-frontend')) {
      return true;
    } else {
      return false;
    }
  });

  await sendCoverage();
});

start();

QUnit.config.testTimeout = config.x.percyIsEnabled ? 10000 : 5000;
