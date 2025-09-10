export default function apiRequestsCount(server) {
  const requests = server.pretender.handledRequests;

  // if no calls were made, requests will be an instance of NoopArray { length: 0 } <-- O_o
  if (!requests.length) {
    return 0;
  }

  const filteredRequests = server.pretender.handledRequests.filter((request) => {
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

  // Debugging
  // console.group(`API Requests (${filteredRequests.length})`);
  // filteredRequests.map((request) => console.log(new URL(request.url).pathname));
  // console.groupEnd();

  return filteredRequests.length;
}
