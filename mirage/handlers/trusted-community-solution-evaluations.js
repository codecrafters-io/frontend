export default function (server) {
  server.post('/trusted-community-solution-evaluations');
  server.patch('/trusted-community-solution-evaluations/:id');
  server.delete('/trusted-community-solution-evaluations/:id');
}
