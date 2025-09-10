export default function verifyApiRequests(server, expectedRequests) {
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
      pathname !== '/api/v1/leaderboard-entries/for-current-user'
    );
  });

  // Debugging
  // console.group('API Requests Verification');
  // console.log('Expected requests:', expectedRequests);
  // console.log('Actual requests:', filteredRequests.map(r => new URL(r.url).pathname));
  // console.groupEnd();

  // Verify number of requests matches
  if (filteredRequests.length !== expectedRequests.length) {
    throw new Error(
      `Expected ${expectedRequests.length} API requests but got ${filteredRequests.length}.\n` +
        `Expected: ${expectedRequests.join(', ')}\n` +
        `Actual: ${filteredRequests.map((r) => new URL(r.url).pathname).join(', ')}`,
    );
  }

  // Verify each request matches in order
  filteredRequests.forEach((request, index) => {
    const actualPath = new URL(request.url).pathname;
    const expectedPath = expectedRequests[index];

    if (actualPath !== expectedPath) {
      throw new Error(`API request mismatch at index ${index}.\n` + `Expected: ${expectedPath}\n` + `Actual: ${actualPath}`);
    }
  });

  return true;
}
