import { Factory, trait } from 'miragejs';
import { readyInterviewAttributes, scoredInterviewReport } from 'codecrafters-frontend/mirage/data/challenge-interview-fixtures';

export default Factory.extend({
  createdAt: () => new Date(),
  milestoneSlug: 'base-stages',
  status: 'generating',

  ready: trait({
    ...readyInterviewAttributes,
  }),

  scored: trait({
    ...readyInterviewAttributes,
    conversationToken: null,
    report: scoredInterviewReport,
    status: 'scored',
  }),
});
