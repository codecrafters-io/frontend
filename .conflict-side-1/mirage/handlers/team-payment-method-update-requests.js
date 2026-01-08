export default function (server) {
  server.post('/team-payment-method-update-requests', function (schema) {
    return schema.teamPaymentMethodUpdateRequests.create({ url: 'https://test.com/team_payment_method_update_request' });
  });
}
