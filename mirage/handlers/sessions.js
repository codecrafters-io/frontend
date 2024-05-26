export default function (server) {
  server.post('/sessions/logout', function () {
    return new Response(200, {}, {});
  });
}
