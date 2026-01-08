export default function (server) {
  server.get('/onboarding-surveys', function (schema, request) {
    return schema.onboardingSurveys.where({ userId: request.queryParams.user_id });
  });

  server.patch('/onboarding-surveys/:id');
}
