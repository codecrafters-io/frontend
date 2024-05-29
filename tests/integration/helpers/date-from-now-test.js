import FakeDateService from 'codecrafters-frontend/tests/support/fake-date-service';
import TimeService from 'codecrafters-frontend/services/time';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

// Dummy date that will be considered "current" or "base" date
const DUMMY_CURRENT_DATE = new Date('2023-08-24T10:35:31.681'); // No "Z" at the end, to be treated as local time

// Example past & future dates and their expected outputs
const DATE_DIFF_EXAMPLES = [
  ['10 minutes ago', new Date('2023-08-24T10:25:31.681')],
  ['30 minutes ago', new Date('2023-08-24T10:05:31.681')],
  ['1 hour ago', new Date('2023-08-24T09:35:31.681')],
  ['1 day ago', new Date('2023-08-23T10:35:31.681')],
  ['2 days ago', new Date('2023-08-22T10:35:31.681')],
  ['3 years ago', new Date('2020-08-24T10:35:31.681')],
  ['in 10 minutes', new Date('2023-08-24T10:45:31.681')],
  ['in 6 hours', new Date('2023-08-24T16:35:31.681')],
  ['in 19 years', new Date('2042-08-24T10:35:31.681')],
];

function setupTimeService(owner, date) {
  owner.unregister('service:time');
  owner.unregister('service:date');
  owner.register('service:date', FakeDateService);

  let dateService = owner.lookup('service:date');
  dateService.setNow(date);

  owner.register('service:time', TimeService);
  let timeService = owner.lookup('service:time');
  timeService.setupTimer();
}

module('Integration | Helper | date-from-now', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders an empty string if passed an undefined date', async function (assert) {
    await render(hbs`{{date-from-now this.undefinedDate}}`);
    assert.dom(this.element).hasText('');
  });

  test('it renders an empty string if passed a null date', async function (assert) {
    this.set('nullDate', null);
    await render(hbs`{{date-from-now this.nullDate}}`);
    assert.dom(this.element).hasText('');
  });

  test('it renders "0 seconds ago" if passed date equals now', async function (assert) {
    this.set('currentDate', DUMMY_CURRENT_DATE);
    this.set('customDate', DUMMY_CURRENT_DATE);

    setupTimeService(this.owner, this.currentDate);

    await render(hbs`{{date-from-now this.customDate}}`);
    assert.dom(this.element).hasText('0 seconds ago');
  });

  // Generate an individual test for every example date diff
  for (const [expectedOutput, providedDate] of DATE_DIFF_EXAMPLES) {
    test(`it renders a human-readable difference between now and "${expectedOutput}"`, async function (assert) {
      this.set('currentDate', DUMMY_CURRENT_DATE);
      this.set('customDate', providedDate);

      setupTimeService(this.owner, this.currentDate);

      await render(hbs`{{date-from-now this.customDate}}`);
      assert.dom(this.element).hasText(expectedOutput);
    });
  }

  test('it renders dates in real time', async function (assert) {
    this.set('currentDate', DUMMY_CURRENT_DATE);
    this.set('customDate', DUMMY_CURRENT_DATE);

    setupTimeService(this.owner, this.currentDate);

    await render(hbs`{{date-from-now this.customDate}}`);
    assert.dom(this.element).hasText('0 seconds ago');

    let timeService = this.owner.lookup('service:time');
    timeService.advanceTimeByMilliseconds(1000);
    await settled();

    assert.dom(this.element).hasText('1 second ago');
  });
});
