export default function apiRequestsCount(server) {
  const filteredRequests = server.pretender.handledRequests.filter((request) => {
    const pathname = new URL(request.url).pathname;

    return pathname !== '/api/v1/analytics-events' && pathname !== '/api/v1/users/current';
  });

  // Debugging
  // console.group(`API Requests (${filteredRequests.length})`);
  // filteredRequests.map((request) => console.log(new URL(request.url).pathname));
  // console.groupEnd();

  return filteredRequests.length;
}
