export default function (server) {
  server.get('/course-extension-ideas');
  server.post('/course-extension-ideas/:id/unvote', () => {});
  server.post('/course-extension-idea-votes');
}
