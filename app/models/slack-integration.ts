import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

import type TeamModel from 'codecrafters-frontend/models/team';

export default class SlackIntegration extends Model {
  @attr('string') declare slackChannelName: string;

  @belongsTo('team', { async: false, inverse: 'slackIntegrations' }) declare team: TeamModel;
}
