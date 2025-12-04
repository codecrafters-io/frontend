import { Factory } from 'miragejs';

export default Factory.extend({
  claimedAt: null,

  managementToken: () => {
    return `mgmt_${Math.random().toString(36).substring(7)}`;
  },

  senderMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',

  purchasedAt() {
    return new Date();
  },

  secretToken: () => {
    return `sec_${Math.random().toString(36).substring(7)}`;
  },

  validityInDays: 365,
});
