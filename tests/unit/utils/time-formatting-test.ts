import { formatTimeLeft } from 'codecrafters-frontend/utils/time-formatting';
import { module, test } from 'qunit';

module('Unit | Utility | time-formatting', function () {
  test('it formats time remaining correctly', function (assert) {
    const currentTime = new Date('2024-01-01T00:00:00Z');

    // Test hours:minutes:seconds format
    assert.strictEqual(formatTimeLeft(new Date('2024-01-01T02:34:56Z'), currentTime), '02h:34m:56s', 'formats hours, minutes and seconds correctly');

    // Test minutes:seconds format
    assert.strictEqual(
      formatTimeLeft(new Date('2024-01-01T00:34:56Z'), currentTime),
      '34m:56s',
      'formats minutes and seconds correctly when hours is 0',
    );

    // Test seconds only format
    assert.strictEqual(formatTimeLeft(new Date('2024-01-01T00:00:45Z'), currentTime), '45s', 'formats seconds only when hours and minutes are 0');

    // Test negative time difference
    assert.strictEqual(formatTimeLeft(new Date('2023-12-31T23:59:59Z'), currentTime), '00s', 'returns 00s for expired time');

    // Test zero seconds
    assert.strictEqual(formatTimeLeft(new Date('2024-01-01T00:00:00Z'), currentTime), '00s', 'formats zero seconds correctly');
  });
});
