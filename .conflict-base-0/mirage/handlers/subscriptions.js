import { Response } from 'miragejs';

export default function (server) {
  server.get('/subscriptions', function (schema) {
    return schema.subscriptions.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });
  });

  server.post('/sessions/logout', function () {
    return new Response(200, {}, {});
  });
}
