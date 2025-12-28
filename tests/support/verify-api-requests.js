export default function verifyApiRequests(server, expectedPaths) {
  const requests = server.pretender.handledRequests;

  // Filter out analytics and current user requests
  const filteredRequests = requests.filter((request) => {
    const pathname = new URL(request.url).pathname;

    return (
      // Triggered on every pageview
      pathname !== '/api/v1/analytics-events' &&
      // Triggered on application boot
      pathname !== '/api/v1/users/current' &&
      // Triggered when header is rendered
      !pathname.match(/^\/api\/v1\/users\/[^/]+\/top-language-leaderboard-slugs$/)
    );
  });

  const actualPaths = filteredRequests.map((request) => new URL(request.url).pathname);

  // Verify number of requests matches
  for (let i = 0; i < Math.max(filteredRequests.length, expectedPaths.length); i++) {
    const expectedPath = expectedPaths[i];
    const actualPath = actualPaths[i];

    if (actualPath !== expectedPath) {
      let lines = [];

      for (let j = 0; j < i; j++) {
        lines.push(`✔ [${j + 1}] ${expectedPaths[j]}`);
      }

      lines.push(`✗ [${i + 1}] Expected: ${expectedPath ? expectedPath : '<none>'} | Actual: ${actualPath ? actualPath : '<none>'}`);

      for (let j = i + 1; j < Math.max(filteredRequests.length, expectedPaths.length); j++) {
        lines.push(
          `   [${j + 1}] Expected: ${expectedPaths[j] ? expectedPaths[j] : '<none>'} | Actual: ${actualPaths[j] ? actualPaths[j] : '<none>'}`,
        );
      }

      throw new Error(lines.join('\n'));
    }
  }

  return true;
}
