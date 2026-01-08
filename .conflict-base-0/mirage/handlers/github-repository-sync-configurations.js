export default function (server) {
  server.get('/github-repository-sync-configurations');
  server.post('/github-repository-sync-configurations');
  server.delete('/github-repository-sync-configurations/:id');
}
