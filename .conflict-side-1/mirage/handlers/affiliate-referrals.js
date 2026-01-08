export default function (server) {
  server.post('/affiliate-referrals', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.activatedAt = new Date();

    return schema.affiliateReferrals.create(attrs);
  });
}
