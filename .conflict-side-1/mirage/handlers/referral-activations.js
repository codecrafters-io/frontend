import { add } from 'date-fns';

export default function (server) {
  server.post('/referral-activations', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    let referralActivation = schema.referralActivations.create(attrs);

    schema.freeUsageGrants.create({
      userId: attrs.referrerId,
      referralActivationId: referralActivation.id,
      activatesAt: new Date('2023-11-17'),
      active: true,
      expiresAt: add(new Date('2023-11-17'), { days: 7 }),
      sourceType: 'referred_other_user',
    });

    schema.freeUsageGrants.create({
      userId: attrs.customerId,
      referralActivationId: referralActivation.id,
      activatesAt: new Date('2023-11-17'),
      active: true,
      expiresAt: add(new Date('2023-11-17'), { days: 7 }),
      sourceType: 'accepted_referral_offer',
    });

    return referralActivation;
  });
}
