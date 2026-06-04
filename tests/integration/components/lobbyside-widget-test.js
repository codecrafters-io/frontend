import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import config from 'codecrafters-frontend/config/environment';
import Service from '@ember/service';

class StubStaffAuthenticatorService extends Service {
  currentUser = { isStaff: true, username: 'staff-user' };
  currentUserId = 'staff-user-id';
}

module('Integration | Component | lobbyside-widget', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.unregister('service:authenticator');
    this.owner.register('service:authenticator', StubStaffAuthenticatorService);
  });

  hooks.afterEach(function () {
    config.x.isStaging = false;
  });

  test('renders the everyone-audience widget mount outside staging', async function (assert) {
    config.x.isStaging = false;

    await render(hbs`<LobbysideWidget @widgetId="widget-1" />`);

    assert.dom('[data-test-lobbyside-widget="widget-1"]').exists();
  });

  test('renders the staff-audience widget mount for staff outside staging', async function (assert) {
    config.x.isStaging = false;

    await render(hbs`<LobbysideWidget @widgetId="widget-staff" @audience="staff" />`);

    assert.dom('[data-test-lobbyside-widget="widget-staff"]').exists();
  });

  test('does not render the everyone-audience widget in staging', async function (assert) {
    config.x.isStaging = true;

    await render(hbs`<LobbysideWidget @widgetId="widget-1" />`);

    assert.dom('[data-test-lobbyside-widget="widget-1"]').doesNotExist();
  });

  test('does not render the staff-audience widget in staging even for staff', async function (assert) {
    config.x.isStaging = true;

    await render(hbs`<LobbysideWidget @widgetId="widget-staff" @audience="staff" />`);

    assert.dom('[data-test-lobbyside-widget="widget-staff"]').doesNotExist();
  });
});
