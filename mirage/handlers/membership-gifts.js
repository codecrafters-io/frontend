export default function (server) {
  server.get('/membership-gifts', function (schema, request) {
    const secretToken = request.queryParams['secret_token'];

    if (!secretToken) {
      throw new Error('Secret token is required');
    }

    return schema.membershipGifts.where({ secretToken });
  });
}
