export default function (server) {
  server.get('/perks', function (schema, request) {
    const slug = request.queryParams.slug;

    return schema.perks.where({ slug });
  });

  server.post('/perks/:id/claim', function () {
    return {
      claim_url: 'https://dummy-claim-url.com',
    };
  });
}
