import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class AdminCourseSubmissionsPage extends Component {
  @service router;

  @tracked requestedLanguage = this.router.currentRoute.queryParams.languages;
  @tracked selectedSubmission = null;

  constructor() {
    super(...arguments);

    this.selectedSubmission = this.args.submissions.toSorted(fieldComparator('createdAt')).at(-1);
  }

  get currentCourseStage() {
    return this.args.filteredCourseStages[0];
  }

  get currentLanguage() {
    return this.args.filteredLanguages[0];
  }

  get filteringDescription() {
    let description = 'Showing submissions in ';

    if (this.args.filteredLanguages[0]) {
      description += `${this.args.filteredLanguages
        .map((item) => item.name)
        .sort()
        .join(' / ')}`;
    } else {
      description += `all languages`;
    }

    description += ', for ';

    if (this.args.filteredCourseStages[0]) {
      description += `stage ${this.args.filteredCourseStages
        .map((item) => item.name)
        .sort()
        .join(' / ')}`;
    } else {
      description += `all stages`;
    }

    return description;
  }

  get filteringTitle() {
    let title = '';

    if (this.args.filteredLanguages[0]) {
      title += `Language: ${this.args.filteredLanguages
        .map((item) => item.name)
        .sort()
        .join(' / ')}`;
    } else {
      title += `Languages: All`;
    }

    title += ' & ';

    if (this.args.filteredCourseStages[0]) {
      title += `Stage: ${this.args.filteredCourseStages
        .map((item) => item.name)
        .sort()
        .join(' / ')}`;
    } else {
      title += `Stages: All`;
    }

    return title;
  }

  get sortedLanguagesForDropdown() {
    return this.args.course.betaOrLiveLanguages.toSorted(fieldComparator('name'));
  }

  @action
  handleAllCourseStagesDropdownLinkClick() {
    this.router.transitionTo({ queryParams: { course_stage_slugs: [] } });
  }

  @action
  handleAllLanguagesDropdownLinkClick() {
    this.router.transitionTo({ queryParams: { languages: [] } });
  }

  @action
  handleCourseStageChange(stage) {
    if (!stage) {
      return;
    }

    this.router.transitionTo({ queryParams: { course_stage_slugs: stage.slug } });
  }

  @action
  handleRequestedLanguageChange(language) {
    if (!language) {
      return;
    }

    this.router.transitionTo({ queryParams: { languages: language.slug } });
  }
}
