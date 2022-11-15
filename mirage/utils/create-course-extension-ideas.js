import courseExtensionIdeasData from '../data/course-extension-ideas';

export default function createCourseExtensionIdeas(server) {
  for (const courseExtensionIdeaData of courseExtensionIdeasData) {
    server.create('course-extension-idea', {
      createdAt: new Date(),
      course: server.schema.courses.findBy({ slug: courseExtensionIdeaData.course_slug }),
      name: courseExtensionIdeaData.name,
      slug: courseExtensionIdeaData.slug,
      descriptionMarkdown: courseExtensionIdeaData.description_md,
      votesCount: 0,
      supervotesCount: 0,
    });
  }
}
