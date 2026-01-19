import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  leaderboard: belongsTo('leaderboard', { inverse: null }),
  user: belongsTo('user', { inverse: 'leaderboardRankCalculations' }),
});
