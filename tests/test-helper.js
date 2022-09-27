import Application from 'codecrafters-frontend/app';
import config from 'codecrafters-frontend/config/environment';
import * as QUnit from 'qunit';
import enableEmberSvgJarErrors from 'codecrafters-frontend/tests/support/enable-ember-svg-jar-errors';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';

import start from 'ember-exam/test-support/start';
import 'qunit-assertions-extra';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

// Hack to ensure ember-svg-jar throws errors
enableEmberSvgJarErrors(QUnit);

start();
