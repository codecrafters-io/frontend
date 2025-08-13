export default function (server) {
  server.get('/course-ideas');
  server.post('/course-ideas/:id/unvote', () => {});
  server.post('/course-idea-votes');
}
