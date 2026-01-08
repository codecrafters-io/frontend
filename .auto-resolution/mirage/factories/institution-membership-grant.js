import { Factory } from 'miragejs';

export default Factory.extend({
  grantedAt: () => new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  validityInDays: 30,
});
