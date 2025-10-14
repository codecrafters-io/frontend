import courseExtensionIdeasData from '../data/course-extension-ideas';

export default function createCourseExtensionIdeas(server) {
  for (const courseExtensionIdeaData of courseExtensionIdeasData) {
    const isReleased = courseExtensionIdeaData.development_status === 'released';

    server.create('course-extension-idea', {
      // eslint-disable-next-line ember/no-array-prototype-extensions
      course: server.schema.courses.findBy({ slug: courseExtensionIdeaData.course_slug }),
      createdAt: new Date(),
      descriptionMarkdown: courseExtensionIdeaData.description_md,
      developmentStatus: courseExtensionIdeaData.development_status,
      name: courseExtensionIdeaData.name,
      slug: courseExtensionIdeaData.slug,
      votesCount: 0,
      releasedAt: isReleased ? new Date('2024-01-01') : null,
      announcementUrl: isReleased ? 'https://forum.codecrafters.io/t/example-released' : null,
    });
  }
}
