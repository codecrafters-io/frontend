import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class LanguageModel extends Model {
  @attr('string') name;
}
