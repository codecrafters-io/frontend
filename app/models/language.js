import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class LanguageModel extends Model {
  @attr('string') name;
  @attr('string') slug;

  get grayLogoUrl() {
    return {
      Python: '/assets/images/language-logos/python-gray-500.svg',
      Go: '/assets/images/language-logos/go-gray-500.svg',
    }[this.name];
  }

  get tealLogoUrl() {
    return {
      Python: '/assets/images/language-logos/python-teal-500.svg',
      Go: '/assets/images/language-logos/go-teal-500.svg',
    }[this.name];
  }
}
