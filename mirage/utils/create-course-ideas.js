import courseIdeasData from '../data/course-ideas';

export default function createCourseIdeas(server) {
  for (const courseIdeaData of courseIdeasData) {
    server.create('course-idea', {
      createdAt: new Date(),
      descriptionMarkdown: courseIdeaData.description_md,
      developmentStatus: courseIdeaData.development_status,
      name: courseIdeaData.name,
      votesCount: 0,
    });
  }
}
