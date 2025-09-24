export default function (server) {
  server.post('/gift-payment-flows');
  server.patch('/gift-payment-flows/:id');

  // TODO: Add this when we implement fetching an existing payment flow
  // server.get('/gift-payment-flows/:id');
}
