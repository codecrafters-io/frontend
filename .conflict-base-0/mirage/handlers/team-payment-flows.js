export default function (server) {
  server.post('/team-payment-flows');
  server.get('/team-payment-flows/:id');
  server.patch('/team-payment-flows/:id');

  server.get('/team-payment-flows/:id/first-invoice-preview', function (schema, request) {
    const teamPaymentFlow = schema.teamPaymentFlows.find(request.params.id);
    const amount = teamPaymentFlow.numberOfSeats * 79000;

    return schema.invoices.create({
      amountDue: amount,
      lineItems: [{ amount: amount, amount_after_discounts: amount, quantity: teamPaymentFlow.numberOfSeats }],
    });
  });

  server.post('/team-payment-flows/:id/attempt-payment', function () {
    return {
      error: 'Your card was declined.',
    };
  });
}
