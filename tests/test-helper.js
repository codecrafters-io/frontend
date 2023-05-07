import Application from 'codecrafters-frontend/app';
import config from 'codecrafters-frontend/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup as setupQunitDom } from 'qunit-dom';
import { setup as setupQunitAssertionsExtra } from 'qunit-assertions-extra';

import start from 'ember-exam/test-support/start';

setApplication(Application.create(config.APP));

setupQunitDom(QUnit.assert);
setupQunitAssertionsExtra(QUnit.assert);

start();
