export default function (server) {
  server.post('/individual-payment-method-update-requests', function (schema) {
    return schema.individualPaymentMethodUpdateRequests.create({ url: 'https://test.com/checkout_session' });
  });
}
