export default function (server) {
  server.get('/community-solution-evaluators');
  server.get('/community-solution-evaluators/:id');

  server.post('/community-solution-evaluators', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.slug = `evaluator-${Date.now()}`;

    return schema.communitySolutionEvaluators.create(attrs);
  });

  server.patch('/community-solution-evaluators/:id', function (schema, request) {
    const evaluator = schema.communitySolutionEvaluators.find(request.params.id);
    const attrs = this.normalizedRequestAttrs();

    return evaluator.update(attrs);
  });
}
