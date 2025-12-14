import Application from 'codecrafters-frontend/app';
import config from 'codecrafters-frontend/config/environment';
import * as QUnit from 'qunit';
import { forceModulesToBeLoaded, sendCoverage } from 'ember-cli-code-coverage/test-support';
import { setupEmberOnerrorValidation } from 'ember-qunit';
import { setApplication } from '@ember/test-helpers';
import { setup as setupQunitDom } from 'qunit-dom';
import { setup as setupQunitAssertionsExtra } from 'qunit-assertions-extra';
import setupSinon from 'ember-sinon-qunit';
import start from 'ember-exam/test-support/start';
import stubLocalStorage from 'codecrafters-frontend/tests/support/stub-local-storage';
import stubClipboard from 'codecrafters-frontend/tests/support/stub-clipboard';
import CurrentMirageUser from 'codecrafters-frontend/mirage/utils/current-mirage-user';

setApplication(Application.create(config.APP));

setupSinon();

setupQunitDom(QUnit.assert);
setupQunitAssertionsExtra(QUnit.assert);
setupEmberOnerrorValidation();

QUnit.testStart(function () {
  stubLocalStorage();
  stubClipboard();
  CurrentMirageUser.onTestStart();
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

QUnit.config.testTimeout = config.x.percyIsEnabled ? 20000 : 5000;
