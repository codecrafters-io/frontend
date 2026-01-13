export default function (server) {
  server.get('/course-definition-updates');
  server.get('/course-definition-updates/:id');

  server.post('/course-definition-updates/:id/apply', function (schema, request) {
    const courseDefinitionUpdate = schema.courseDefinitionUpdates.find(request.params.id);

    if (courseDefinitionUpdate.summary.includes('[should_error]')) {
      courseDefinitionUpdate.update({ lastErrorMessage: 'Expected "slug" to be "redis", got: "docker".\n\nChange slug to "redis" to fix this.' });
    } else {
      courseDefinitionUpdate.update({ appliedAt: new Date(), status: 'applied', lastErrorMessage: null });
    }

    return courseDefinitionUpdate;
  });
}
