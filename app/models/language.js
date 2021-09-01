import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class LanguageModel extends Model {
  @attr('string') name;

  get grayLogoUrl() {
    return {
      PYTHON: '/assets/images/language-logos/python-gray-500.svg',
      GO: '/assets/images/language-logos/go-gray-500.svg',
    }[this.id];
  }

  get tealLogoUrl() {
    return {
      PYTHON: '/assets/images/language-logos/python-teal-500.svg',
      GO: '/assets/images/language-logos/go-teal-500.svg',
    }[this.id];
  }
}
