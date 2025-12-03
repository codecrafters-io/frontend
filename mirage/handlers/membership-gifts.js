import CurrentMirageUser from '../utils/current-mirage-user';

export default function (server) {
  server.get('/membership-gifts', function (schema, request) {
    const secretToken = request.queryParams['secret_token'];

    if (!secretToken) {
      throw new Error('Secret token is required');
    }

    return schema.membershipGifts.where({ secretToken });
  });

  server.post('/membership-gifts/:id/redeem', function (schema, request) {
    const membershipGift = schema.membershipGifts.find(request.params.id);

    if (!membershipGift) {
      return new Response(404, {}, { error: 'Gift not found' });
    }

    membershipGift.update({ redeemedAt: new Date() });

    schema.subscriptions.create({
      user: schema.users.find(CurrentMirageUser.currentUserId),
      source: membershipGift,
      startDate: membershipGift.redeemedAt.toISOString(),
      cancelAt: new Date(membershipGift.redeemedAt.getTime() + membershipGift.validityInDays * 24 * 60 * 60 * 1000).toISOString(),
    });

    return {};
  });
}
