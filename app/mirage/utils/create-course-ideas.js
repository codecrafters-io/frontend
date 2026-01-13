import courseIdeasData from '../data/course-ideas';

export default function createCourseIdeas(server) {
  for (const courseIdeaData of courseIdeasData) {
    const isReleased = courseIdeaData.development_status === 'released';

    server.create('course-idea', {
      createdAt: new Date(),
      descriptionMarkdown: courseIdeaData.description_md,
      developmentStatus: courseIdeaData.development_status,
      isArchived: courseIdeaData.is_archived || false,
      name: courseIdeaData.name,
      votesCount: 0,
      releasedAt: isReleased ? new Date('2024-01-01') : null,
      announcementUrl: isReleased ? 'https://forum.codecrafters.io/t/example-released' : null,
    });
  }
}
