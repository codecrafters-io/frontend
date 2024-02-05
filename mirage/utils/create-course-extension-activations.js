export default function createCourseExtensionActivations(server, repository) {
  repository.course.extensions.models.forEach((extension) => {
    server.create('course-extension-activation', {
      extension,
      repository
    });
  });
}
