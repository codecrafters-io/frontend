module.exports = function (request, response) {
  const { accelerationMode = 'default' } = request.query;
  response.send(`Hello from SynchroPhasoTron9000 (JS)! Acceleration mode: ${accelerationMode}! Generated at: ${(new Date()).toISOString()}`);
}

// import type { VercelRequest, VercelResponse } from '@vercel/node';

// export default function (request: VercelRequest, response: VercelResponse) {
//   const { accelerationMode = 'default' } = request.query;
//   response.send(`Hello from SynchroPhasoTron9000! Acceleration mode: ${accelerationMode}!`);
// }
