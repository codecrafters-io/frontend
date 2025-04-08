import courseExtensionIdeasData from '../data/course-extension-ideas';

export default function createCourseExtensionIdeas(server) {
  for (const courseExtensionIdeaData of courseExtensionIdeasData) {
    server.create('course-extension-idea', {
      course: server.schema.courses.findBy({ slug: courseExtensionIdeaData.course_slug }),
      createdAt: new Date(),
      descriptionMarkdown: courseExtensionIdeaData.description_md,
      developmentStatus: courseExtensionIdeaData.development_status,
      developmentStatusLabelText: courseExtensionIdeaData.development_status_label,
      name: courseExtensionIdeaData.name,
      slug: courseExtensionIdeaData.slug,
      votesCount: 0,
    });
  }
}
