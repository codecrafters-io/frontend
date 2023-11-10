import { Factory } from 'miragejs';

export default Factory.extend({
  withdrawableEarningsAmountInCents: () => 0,
  withheldEarningsAmountInCents: () => 0,
});
