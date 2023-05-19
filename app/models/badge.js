import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class Badge extends Model {
  @attr('string') name;
  @attr('string') slug;
  @attr('string') descriptionMarkdown;
  @attr('string') instructionsMarkdown;

  @hasMany('badge-award', { async: false, inverse: null }) currentUserAwards;
}
