import { Factory } from 'miragejs';

export default Factory.extend({
  createdAt: () => new Date(),
});
