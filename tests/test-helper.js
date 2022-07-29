import Application from 'codecrafters-frontend/app';
import config from 'codecrafters-frontend/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import start from 'ember-exam/test-support/start';

import 'qunit-assertions-extra';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
