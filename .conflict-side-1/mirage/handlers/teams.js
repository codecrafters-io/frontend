export default function (server) {
  server.get('/teams');

  server.post('/teams', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const team = schema.teams.create({ name: attrs.name });
    schema.teamMemberships.create({ isAdmin: true, team: team, userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });

    return team;
  });

  server.get('/teams/:id/first-invoice-preview', function (schema) {
    return schema.invoices.create({ amountDue: 790000, lineItems: [{ amount: 790000, amount_after_discounts: 790000, quantity: 10 }] });
  });

  server.post('/team-subscriptions');
}
