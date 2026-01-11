import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  contest: belongsTo('contest', { inverse: 'leaderboard' }),
  language: belongsTo('language', { inverse: 'leaderboard' }),
  entries: hasMany('leaderboard-entry', { inverse: 'leaderboard' }),
});
