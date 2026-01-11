export default function (server) {
  server.get('/course-tester-versions');
  server.get('/course-tester-versions/:id');

  server.post('/course-tester-versions/:id/activate', function (schema, request) {
    const courseTesterVersion = schema.courseTesterVersions.find(request.params.id);
    courseTesterVersion.update({ isActive: true });

    const otherTesterVersions = schema.courseTesterVersions.where((version) => version.id !== courseTesterVersion.id);
    otherTesterVersions.update({ isActive: false });

    return courseTesterVersion;
  });

  server.post('/course-tester-versions/:id/deprovision', function (schema, request) {
    return schema.courseTesterVersions.find(request.params.id);
  });
}
