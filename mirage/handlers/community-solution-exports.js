export default function (server) {
  server.post('/community-solution-exports');

  server.post('/community-solution-exports/:id/mark-as-accessed', function (schema, request) {
    return schema.communitySolutionExports.find(request.params.id);
  });
}
