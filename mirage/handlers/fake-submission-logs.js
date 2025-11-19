import { Response } from 'miragejs';

export default function (server) {
  server.get('/fake-submission-logs', function (schema, request) {
    if (request.queryParams.type === 'success') {
      return new Response(200, {}, '\x1b[92m[stage-1] passed\x1b[0m\n\x1b[92m[stage-2] passed\x1b[0m');
    } else {
      // Generate 20 lines of colored failure output for stages 1-20
      const lines = [];

      for (let i = 1; i <= 20; i++) {
        lines.push(`\x1b[91m[stage-${i}] failure\x1b[0m`);
      }

      return new Response(200, {}, lines.join('\n'));
    }
  });
}
