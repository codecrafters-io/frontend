import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

import type UserModel from 'codecrafters-frontend/models/user';

export default class SiteFeedbackSubmissionModel extends Model {
  @attr('string') declare explanation: string;
  @attr('string') declare pageUrl: string;
  @attr('string') declare selectedSentiment: string;
  @attr('string') declare source: string;
  @attr() declare sourceMetadata: { [key: string]: string };

  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;
}
