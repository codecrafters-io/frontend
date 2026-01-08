import CurrentMirageUser from '../utils/current-mirage-user';
import { Response } from 'miragejs';

export default function (server) {
  server.get('/membership-gifts', function (schema, request) {
    const secretToken = request.queryParams['secret_token'];
    const managementToken = request.queryParams['management_token'];

    if (secretToken) {
      return schema.membershipGifts.where({ secretToken });
    } else if (managementToken) {
      return schema.membershipGifts.where({ managementToken });
    } else {
      throw new Error('secret_token or management_token parameter is required');
    }
  });

  server.patch('/membership-gifts/:id', function (schema, request) {
    const membershipGift = schema.membershipGifts.find(request.params.id);

    if (!membershipGift) {
      return new Response(404, {}, { error: 'Gift not found' });
    }

    const attrs = this.normalizedRequestAttrs();
    membershipGift.update(attrs);

    return membershipGift;
  });

  server.post('/membership-gifts/:id/redeem', function (schema, request) {
    const membershipGift = schema.membershipGifts.find(request.params.id);

    if (!membershipGift) {
      return new Response(404, {}, { error: 'Gift not found' });
    }

    if (JSON.parse(request.requestBody).secret_token !== membershipGift.secretToken) {
      return new Response(400, {}, { error: 'Invalid secret token' });
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
