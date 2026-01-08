export default function (server) {
  server.get('/contests');

  server.get('/contests/:slug', function (schema, request) {
    return schema.contests.where({ slug: request.params.slug }).models[0];
  });
}
