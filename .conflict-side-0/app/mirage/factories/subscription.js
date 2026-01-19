import { Factory } from 'miragejs';

export default Factory.extend({
  baseValidityInDays: 30,
  rolloverValidityInDays: 0,
  startedAt: () => new Date(),
});
