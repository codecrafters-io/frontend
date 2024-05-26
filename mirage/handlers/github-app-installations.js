export default function (server) {
  server.get('/github-app-installations');
  server.get('/github-app-installations/:id');

  server.get('/github-app-installations/:id/accessible-repositories', function () {
    return [
      { id: 564057934, full_name: 'rohitpaulk/cc-publish-test', created_at: '2022-11-09T22:40:59Z' },
      { id: 564057935, full_name: 'rohitpaulk/other-repo', created_at: '2022-10-08T22:40:59Z' },
    ];
  });
}
