import courseIdeasData from '../data/course-ideas';

export default function createCourseIdeas(server) {
  for (const courseIdeaData of courseIdeasData) {
    server.create('course-idea', {
      createdAt: new Date(),
      name: courseIdeaData.name,
      descriptionMarkdown: courseIdeaData.description_md,
      votesCount: 0,
      supervotesCount: 0,
    });
  }
}
