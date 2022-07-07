import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class SlackIntegration extends Model {
  @attr('string') slackChannelName;
  @attr('string') slackTeamName;
  @belongsTo('user', { async: false }) creator;
  @belongsTo('team', { async: false }) team;
}
