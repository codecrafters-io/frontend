export default function (server) {
  server.get('/referral-links', function (schema, request) {
    if (request.queryParams.user_id) {
      return schema.referralLinks.where({ userId: request.queryParams.user_id });
    } else if (request.queryParams.slug) {
      return schema.referralLinks.where({ slug: request.queryParams.slug });
    }
  });

  server.post('/referral-links', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.url = 'https://app.codecrafters.io/r/dummy';

    return schema.referralLinks.create(attrs);
  });
}
