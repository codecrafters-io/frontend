export default function (server) {
  server.get('/course-stage-feedback-submissions', function (schema, request) {
    return schema.courseStageFeedbackSubmissions.all().filter((submission) => submission.courseStage.course.id === request.queryParams.course_id);
  });

  server.post('/course-stage-feedback-submissions');
  server.patch('/course-stage-feedback-submissions/:id');
}
