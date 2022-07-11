import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CodeWalkthrough extends Model {
  @attr('') sections; // free-form JSON
}
