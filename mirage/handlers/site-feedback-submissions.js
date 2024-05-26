export default function (server) {
  server.post('/site-feedback-submissions');

  server.get('/site-feedback-submissions', function (schema, request) {
    return schema.siteFeedbackSubmissions.all().filter((submission) => submission.courseStage.course.id === request.queryParams.course_id);
  });

  server.patch('/site-feedback-submissions/:id');
}
