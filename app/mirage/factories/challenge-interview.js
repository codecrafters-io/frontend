import { Factory, trait } from 'miragejs';
import { readyInterviewAttributes, readyQuizAttributes, scoredInterviewReport } from 'codecrafters-frontend/mirage/data/challenge-interview-fixtures';

export default Factory.extend({
  createdAt: () => new Date(),
  format: 'practice',
  isSubmitted: false,
  milestoneSlug: 'base-stages',
  status: 'generating',

  ready: trait({
    ...readyInterviewAttributes,
  }),

  scored: trait({
    ...readyInterviewAttributes,
    conversationToken: null,
    isSubmitted: true,
    report: scoredInterviewReport,
    status: 'scored',
  }),

  readyQuiz: trait({
    ...readyQuizAttributes,
    competitionSlug: 'redis-sprint',
    format: 'competition',
    milestoneSlug: null,
  }),

  submittedQuiz: trait({
    ...readyQuizAttributes,
    competitionSlug: 'redis-sprint',
    conversationToken: null,
    format: 'competition',
    isSubmitted: true,
    milestoneSlug: null,
    report: null,
    status: 'scored',
  }),
});
