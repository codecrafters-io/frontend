export default function (server) {
  server.post('/course-extension-activations');
  server.delete('/course-extension-activations/:id');
}
