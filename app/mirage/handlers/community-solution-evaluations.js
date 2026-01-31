import { Response } from 'miragejs';

export default function (server) {
  server.get('/community-solution-evaluations', function (schema, request) {
    let result = schema.communitySolutionEvaluations.all();

    if (request.queryParams.result) {
      result = result.filter((evaluation) => evaluation.result === request.queryParams.result);
    }

    return result;
  });

  server.post('/community-solution-evaluations/:id/regenerate', (schema, request) => {
    const evaluation = schema.communitySolutionEvaluations.find(request.params.id);
    evaluation.update({ requiresRegeneration: true });

    return evaluation;
  });

  server.post('/community-solution-evaluations/generate_for_evaluator', (schema) => {
    return schema.communitySolutionEvaluations.all();
  });

  server.post('/community-solution-evaluations/generate_for_solutions', (schema) => {
    return schema.communitySolutionEvaluations.all();
  });

  server.get('/fake-community-solution-evaluation-logs', () => {
    return new Response(200, {}, 'Test log');
  });

  server.get('/fake-community-solution-evaluation-prompt-file', () => {
    return new Response(200, {}, 'Test prompt file');
  });
}
