import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class SiteFeedbackSubmissionModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) user;

  @attr('string') explanation;
  @attr('string') pageUrl;
  @attr('string') selectedSentiment;
  @attr('string') argSource;
  @attr() argSourceMetadata;
}
