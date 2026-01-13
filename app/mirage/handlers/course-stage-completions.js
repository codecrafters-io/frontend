export default function (server) {
  server.post('/course-stage-completions', function () {
    const attrs = this.normalizedRequestAttrs();
    attrs.completedAt = new Date();

    // Use server.create() instead of schema.create() to trigger factory's afterCreate hook
    return server.create('course-stage-completion', attrs);
  });
}
