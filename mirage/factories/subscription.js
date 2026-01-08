import { Factory } from 'miragejs';

export default Factory.extend({
  startedAt: () => new Date(),
});
