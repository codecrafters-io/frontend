export default function apiRequestsCount(server) {
  const requests = server.pretender.handledRequests;

  // if no calls were made, requests will be an instance of NoopArray { length: 0 } <-- O_o
  if (!requests.length) {
    return 0;
  }

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
