import { Response } from 'miragejs';

export default function (server) {
  server.get('/fake-submission-logs', function (schema, request) {
    if (request.queryParams.type === 'success') {
      return new Response(200, {}, '\x1b[92m[stage-1] passed\x1b[0m\n\x1b[92m[stage-2] passed\x1b[0m');
    } else {
      return new Response(200, {}, '\x1b[91m[stage-1] failure\x1b[0m\n\x1b[91m[stage-2] failure\x1b[0m');
    }
  });
}
