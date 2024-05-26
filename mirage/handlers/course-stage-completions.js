export default function (server) {
  server.post('/course-stage-completions', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.completedAt = new Date();

    return schema.courseStageCompletions.create(attrs);
  });
}
