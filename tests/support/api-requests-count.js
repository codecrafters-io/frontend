export default function apiRequestsCount(server) {
  // Debugging
  const filteredRequests = server.pretender.handledRequests.filter((request) => {
    const pathname = new URL(request.url).pathname;

    return pathname !== '/api/v1/analytics-events' && pathname !== '/api/v1/users/current';
  });

  // Debugging
  // filteredRequests.map((request) => console.log(new URL(request.url).pathname));

  return filteredRequests.length;
}
