export default function (server) {
  server.get('/course-language-requests');
  server.post('/course-language-requests');
  server.delete('/course-language-requests/:id');
}
