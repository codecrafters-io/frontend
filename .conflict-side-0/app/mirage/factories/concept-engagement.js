import { Factory } from 'miragejs';

export default Factory.extend({
  currentProgressPercentage: 0,
  lastActivityAt: () => new Date(),
  startedAt: () => new Date(),
});
