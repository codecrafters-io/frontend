export default function (server) {
  server.post('/institution-membership-grant-applications', function (schema) {
    const attrs = this.normalizedRequestAttrs();

    const approvedApplication = schema.institutionMembershipGrantApplications.findBy({
      normalizedEmailAddress: attrs.normalizedEmailAddress,
      institutionId: attrs.institutionId,
      status: 'approved',
    });

    if (approvedApplication) {
      attrs.status = 'rejected';
    } else {
      attrs.status = 'awaiting_verification';
    }

    return schema.institutionMembershipGrantApplications.create(attrs);
  });

  server.get('/institution-membership-grant-applications', function (schema) {
    return schema.institutionMembershipGrantApplications.all();
  });
}
