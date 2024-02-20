import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AdminCourseSubmissionsPageComponent extends Component {
  @service router;

  @tracked requestedLanguage = this.router.currentRoute.queryParams.languages;
  @tracked selectedSubmission = null;

  constructor() {
    super(...arguments);

    this.selectedSubmission = this.args.submissions.sortBy('createdAt').at(-1);
  }

  get currentLanguage() {
    return this.args.filteredLanguages[0];
  }

  get filteringDescription() {
    if (this.args.filteredLanguages[0]) {
      return `Showing submissions in ${this.args.filteredLanguages.mapBy('name').sort().join(' / ')}`;
    } else {
      return `Showing submissions in all languages`;
    }
  }

  get filteringTitle() {
    if (this.args.filteredLanguages[0]) {
      return `${this.args.filteredLanguages.mapBy('name').sort().join(' / ')}`;
    } else {
      return `All Languages`;
    }
  }

  get sortedLanguagesForDropdown() {
    return this.args.course.betaOrLiveLanguages.sortBy('name');
  }

  get sortedStagesForDropdown() {
    return this.args.course.stages.sortBy('position');
  }

  @action
  handleAllLanguagesDropdownLinkClick() {
    this.router.transitionTo({ queryParams: { languages: [] } });
  }

  @action
  handleRequestedLanguageChange(language) {
    if (!language) {
      return;
    }

    this.router.transitionTo({ queryParams: { languages: language.slug } });
  }

  @action
  handleRequestedStageChange(stage) {
    if (!stage) {
      return;
    }

    this.router.transitionTo({ queryParams: { course_stage_slugs: stage.slug } });
  }
}
