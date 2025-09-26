export default function (server) {
  server.post('/gift-payment-flows');
  server.patch('/gift-payment-flows/:id');

  // TODO: Add this when we implement fetching an existing payment flow
  // server.get('/gift-payment-flows/:id');

  server.post('/gift-payment-flows/:id/generate-checkout-session', function (schema, request) {
    const body = JSON.parse(request.requestBody);

    return {
      link: 'https://checkout.stripe.com/test-checkout-session',
      success_url: body.successUrl || body.success_url,
      cancel_url: body.cancelUrl || body.cancel_url,
    };
  });
}
