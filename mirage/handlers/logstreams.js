export default function (server) {
  server.get('/logstreams/:id/poll', function (schema, request) {
    const logstream = schema.fakeLogstreams.find(request.params.id);

    if (!request.queryParams.cursor) {
      return {
        content: logstream.chunks.join(''),
        next_cursor: logstream.isTerminated ? null : `cursor_${logstream.chunks.length}`,
      };
    } else if (request.queryParams.cursor.startsWith('cursor_')) {
      const index = parseInt(request.queryParams.cursor.replace('cursor_', ''), 10);

      return {
        content: logstream.chunks.slice(index).join(''),
        next_cursor: logstream.isTerminated ? null : `cursor_${logstream.chunks.length}`,
      };
    } else {
      throw new Error(`Unknown cursor: ${request.queryParams.cursor}`);
    }
  });
}
