export default function (server) {
  server.get('/community-course-stage-solution-comments', function (schema, request) {
    let result = schema.communityCourseStageSolutionComments.all().filter((comment) => comment.targetId.toString() === request.queryParams.target_id);

    return result;
  });

  server.post('/community-course-stage-solution-comments', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.createdAt = new Date();

    return schema.communityCourseStageSolutionComments.create(attrs);
  });

  server.post('/community-course-stage-solution-comments/:id/unvote', () => {});
}
