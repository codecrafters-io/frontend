import Model, { belongsTo } from '@ember-data/model';
import { attr } from '@ember-data/model';
import { TemporaryUserModel } from './temporary-types';

export default class ConceptModel extends Model {
  @belongsTo('user', { async: false }) declare author: TemporaryUserModel;

  @attr() conceptSlugs!: Array<string>;
  @attr('string') descriptionMarkdown!: string;
  @attr('string') slug!: string;
  @attr('string') title!: string;
}
