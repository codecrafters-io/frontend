import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CourseStageSolutionPageLanguageDropdownComponent extends Component {
  @service router;

  @action
  handleLanguageDropdownLinkClick(language, closeDropdownFn) {
    this.router.transitionTo(this.router.currentRouteName, { queryParams: { language: language.slug } });
    closeDropdownFn();
  }

  get languagesWithSolutions() {
    return this.args.courseStage.solutions.mapBy('language').uniq().sortBy('name');
  }

  get languagesWithoutSolutions() {
    return this.args.courseStage.course.supportedLanguages
      .filter((language) => {
        return !this.languagesWithSolutions.includes(language);
      })
      .sortBy('name');
  }
}
