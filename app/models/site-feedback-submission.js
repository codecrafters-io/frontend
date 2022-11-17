import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class SiteFeedbackSubmissionModel extends Model {
  @belongsTo('user', { async: false }) user;

  @attr('string') selectedSentiment;
  @attr('string') explanation;
}
