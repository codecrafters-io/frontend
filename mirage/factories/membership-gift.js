import { Factory } from 'miragejs';

export default Factory.extend({
  claimedAt: null,
  purchasedAt() {
    return new Date();
  },
  validityInDays: 365,
  giftMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',
  secretCode: 'xyz',
});
