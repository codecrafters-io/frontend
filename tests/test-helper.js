import Application from 'codecrafters-frontend/app';
import config from 'codecrafters-frontend/config/environment';
import * as QUnit from 'qunit';
import { forceModulesToBeLoaded, sendCoverage } from 'ember-cli-code-coverage/test-support';
import { setApplication } from '@ember/test-helpers';
import { setup as setupQunitDom } from 'qunit-dom';
import { setup as setupQunitAssertionsExtra } from 'qunit-assertions-extra';
import setupSinon from 'ember-sinon-qunit';
import sinon from 'sinon';

import start from 'ember-exam/test-support/start';
// import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

setupSinon();

setupQunitDom(QUnit.assert);
setupQunitAssertionsExtra(QUnit.assert);

QUnit.testStart(function () {
  const localStorageCache = new Map();

  sinon.stub(window.localStorage, 'getItem').callsFake(function (key) {
    return localStorageCache.get(key);
  });

  sinon.stub(window.localStorage, 'setItem').callsFake(function (key, value) {
    localStorageCache.set(key, value);
  });

  sinon.stub(window.localStorage, 'removeItem').callsFake(function (key) {
    localStorageCache.delete(key);
  });

  sinon.stub(window.localStorage, 'clear').callsFake(function () {
    localStorageCache.clear();
  });

  sinon.stub(window.localStorage, 'key').callsFake(function (index) {
    return localStorageCache.key(index);
  });

  sinon.stub(window.localStorage.__proto__, 'length').get(function () {
    return localStorageCache.size;
  });
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
