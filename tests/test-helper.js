import Application from 'codecrafters-frontend/app';
import config from 'codecrafters-frontend/config/environment';
import * as QUnit from 'qunit';
import { forceModulesToBeLoaded, sendCoverage } from 'ember-cli-code-coverage/test-support';
import { setApplication } from '@ember/test-helpers';
import { setup as setupQunitDom } from 'qunit-dom';
import { setup as setupQunitAssertionsExtra } from 'qunit-assertions-extra';

import start from 'ember-exam/test-support/start';

setApplication(Application.create(config.APP));

setupQunitDom(QUnit.assert);
setupQunitAssertionsExtra(QUnit.assert);

start();

QUnit.done(async function () {
  forceModulesToBeLoaded((type, moduleName) => {
    // These throw errors for some reason
    if (
      [
        '@ember/template-compilation/index',
        'prismjs/components/prism-crystal',
        'ember-exam/test-support/-private/ember-exam-mocha-test-loader',
        'ember-tooltips/test-support/jquery/assertions/index',
        'codecrafters-frontend/tailwind.config',
      ].includes(moduleName)
    ) {
      return false;
    }

    if (moduleName.startsWith('ember-tooltips/test-support/jquery')) {
      return false;
    }

    return true;
  });

  await sendCoverage();
});
