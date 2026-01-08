import { Factory } from 'miragejs';

export default Factory.extend({
  startDate: () => new Date(),
});
