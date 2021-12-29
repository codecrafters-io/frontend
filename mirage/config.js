export default function () {
  this.urlPrefix = '';
  this.namespace = '/api/v1';
  this.timing = 1000;

  window.server = this; // Hack! Is there a better way?

  this.post('/billing-sessions', function (schema) {
    return schema.billingSessions.create({ url: 'https://test.com/billing_session' });
  });

  this.post('/checkout-sessions', function (schema) {
    return schema.checkoutSessions.create({ url: 'https://test.com/checkout_session' });
  });

  this.get('/courses');

  this.get('/leaderboard-entries');

  this.get('/repositories', function (schema) {
    return schema.repositories.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });
  });

  this.post('/repositories', function (schema) {
    let attrs = this.normalizedRequestAttrs();

    attrs.cloneUrl = 'https://test';
    attrs.name = 'Language #n';

    return schema.repositories.create(attrs);
  });

  this.get('/submissions');

  this.get('/subscriptions', function (schema) {
    return schema.subscriptions.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });
  });

  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
  this.passthrough('https://rs.fullstory.com/*');
}
