export default function (server) {
  server.get('/courses');

  server.post('/courses/:id/sync-course-definition-updates', function (schema, request) {
    const course_id = request.params.id;

    return schema.courseDefinitionUpdates.where({ course_id });
  });

  server.post('/courses/:id/sync-course-tester-versions', function (schema, request) {
    const course_id = request.params.id;

    return schema.courseTesterVersions.where({ course_id });
  });
}
