import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CoursePageContentStepListSetupItemRequestLanguageButtonComponent extends Component {
  @tracked selectedLanguages = [];
  @service store;

  get availableLanguages() {
    return this.store.peekAll('language');
  }

  @action
  handleLanguageSelection(languages) {
    console.log(languages);
    this.selectedLanguages = languages;
  }
}
