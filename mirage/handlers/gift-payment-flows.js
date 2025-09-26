export default function (server) {
  server.post('/gift-payment-flows');
  server.patch('/gift-payment-flows/:id');

  server.get('/gift-payment-flows/:id');

  server.post('/gift-payment-flows/:id/generate-checkout-session', function (schema, request) {
    const body = JSON.parse(request.requestBody);

    if (!body['success-url']) {
      throw new Error('success-url is required');
    }

    if (!body['cancel-url']) {
      throw new Error('cancel-url is required');
    }

    return {
      link: 'https://checkout.stripe.com/test-checkout-session',
    };
  });
}
