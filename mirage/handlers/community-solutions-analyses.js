export default function (server) {
  server.get('/community-solutions-analyses');
  server.post('/community-solutions-analyses');
  server.patch('/community-solutions-analyses/:id');
  server.delete('/community-solutions-analyses/:id');
}
