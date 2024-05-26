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

  server.post('/course-extension-activations');
  server.delete('/course-extension-activations/:id');

  server.get('/course-extension-ideas');
  server.post('/course-extension-ideas/:id/unvote', () => {});
  server.post('/course-extension-idea-votes');

  server.get('/course-ideas');
  server.post('/course-ideas/:id/unvote', () => {});
  server.post('/course-idea-votes');

  server.get('/course-language-requests');
  server.post('/course-language-requests');
  server.delete('/course-language-requests/:id');

  server.get('/course-stage-comments', function (schema, request) {
    let result = schema.courseStageComments.all().filter((comment) => comment.targetId.toString() === request.queryParams.target_id);

    return result;
  });

  server.post('/course-stage-comments', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.createdAt = new Date();

    return schema.courseStageComments.create(attrs);
  });

  server.delete('/course-stage-comments/:id');
  server.patch('/course-stage-comments/:id');
  server.post('/course-stage-comments/:id/unvote', () => {});

  server.post('/course-stage-completions', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.completedAt = new Date();

    return schema.courseStageCompletions.create(attrs);
  });

  server.get('/course-stage-language-guides');

  server.get('/course-tester-versions');
  server.get('/course-tester-versions/:id');

  server.post('/course-tester-versions/:id/activate', function (schema, request) {
    const courseTesterVersion = schema.courseTesterVersions.find(request.params.id);
    courseTesterVersion.update({ isActive: true });

    const otherTesterVersions = schema.courseTesterVersions.where((version) => version.id !== courseTesterVersion.id);
    otherTesterVersions.update({ isActive: false });

    return courseTesterVersion;
  });

  server.post('/course-tester-versions/:id/deprovision', function (schema, request) {
    return schema.courseTesterVersions.find(request.params.id);
  });

  server.get('/course-stage-feedback-submissions', function (schema, request) {
    return schema.courseStageFeedbackSubmissions.all().filter((submission) => submission.courseStage.course.id === request.queryParams.course_id);
  });

  server.post('/course-stage-feedback-submissions');
  server.patch('/course-stage-feedback-submissions/:id');
}
