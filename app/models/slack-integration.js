import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class SlackIntegration extends Model {
  @attr('string') slackChannelName;
  @belongsTo('team', { async: false, inverse: 'slackIntegrations' }) team;
}
