export default function (server) {
  server.post('/individual-checkout-sessions', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.url = 'https://test.com/checkout_session';

    return schema.individualCheckoutSessions.create(attrs);
  });
}
