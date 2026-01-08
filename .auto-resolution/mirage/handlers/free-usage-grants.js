export default function (server) {
  server.get('/free-usage-grants', function (schema, request) {
    return schema.freeUsageGrants.where({ userId: request.queryParams.user_id });
  });
}
