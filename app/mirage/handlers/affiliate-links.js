export default function (server) {
  server.get('/affiliate-links');

  server.post('/affiliate-links', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.url = `https://app.codecrafters.io/join?via=${attrs.slug}`;

    return schema.affiliateLinks.create(attrs);
  });
}
