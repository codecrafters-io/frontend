export default function createCourseExtensionActivations(server, repository) {
  repository.course.extensions.models.forEach((extension, index) => {
    server.create('course-extension-activation', {
      extension,
      repository,
      position: index + 1, // 1-based position
    });
  });
}
