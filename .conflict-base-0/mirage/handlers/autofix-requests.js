export default function (server) {
  server.get('/autofix-requests/:id');

  server.post('/autofix-requests', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const fakeLogstream = schema.fakeLogstreams.create({ chunks: [], isTerminated: false });

    attrs.createdAt = new Date();
    attrs.status = 'in_progress';
    attrs.logstream_id = fakeLogstream.id;

    return schema.autofixRequests.create(attrs);
  });
}
