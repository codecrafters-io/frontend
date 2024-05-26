export default function (server) {
  server.get('/submissions', function (schema, request) {
    const queryParams = request.queryParams;

    return schema.submissions
      .all()
      .filter((submission) => submission.repository.course.id === queryParams.course_id)
      .filter((submission) => !queryParams.usernames || queryParams.usernames.includes(submission.repository.user.username))
      .filter((submission) => !queryParams.language_slugs || queryParams.language_slugs.includes(submission.repository.language.slug))
      .filter((submission) => !queryParams.course_stage_slugs || queryParams.course_stage_slugs.includes(submission.courseStage.slug));
  });
}
