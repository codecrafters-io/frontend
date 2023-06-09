export default function apiRequestsCount(server) {
  return server.pretender.handledRequests.filter((request) => !request.url.startsWith('/api/v1/analytics-events')).length;
}
