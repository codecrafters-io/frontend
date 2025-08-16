export default function (server) {
  server.post('/community-solution-exports', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.status = 'provisioned';
    attrs.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    attrs.githubRepositoryUrl = 'https://github.com/cc-code-examples/ruby-redis';
    
    return schema.communitySolutionExports.create(attrs);
  });

  server.post('/community-solution-exports/:id/mark-as-accessed', function (schema, request) {
    return schema.communitySolutionExports.find(request.params.id);
  });
}
