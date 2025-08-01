export default function (server) {
  server.post('/institution-membership-grant-applications', function (schema, request) {
    const attrs = JSON.parse(request.requestBody);
    attrs['status'] = 'awaiting_verification';

    return schema.institutionMembershipGrantApplications.create(attrs);
  });
}
