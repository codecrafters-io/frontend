import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  affiliateLink: belongsTo('affiliate-link', { inverse: null }),
  leaderboard: belongsTo('leaderboard', { inverse: 'entries' }),
  latestScoreUpdate: belongsTo('leaderboard-score-update', { inverse: null }),
  user: belongsTo('user', { inverse: null }),
});
