export default function (server) {
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
}
