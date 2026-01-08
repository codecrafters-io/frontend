import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type SubmissionModel from 'codecrafters-frontend/models/submission';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    submissions: SubmissionModel[];
    filteredLanguages: LanguageModel[];
    filteredCourseStages: CourseStageModel[];
  };
}

export default class AdminCourseSubmissionsPage extends Component<Signature> {
  @service declare router: RouterService;

  @tracked requestedLanguage: LanguageModel | null = null;
  @tracked selectedSubmission: SubmissionModel | null = null;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.selectedSubmission = this.args.submissions.toSorted(fieldComparator('createdAt')).at(-1) ?? null;
    this.requestedLanguage = this.args.filteredLanguages[0] || null;
  }

  get currentCourseStage() {
    return this.args.filteredCourseStages[0] || null;
  }

  get currentLanguage() {
    return this.args.filteredLanguages[0] || null;
  }

  get filteringDescription() {
    let description = 'Showing submissions in ';

    if (this.args.filteredLanguages[0]) {
      description += `${this.args.filteredLanguages
        .map((item: LanguageModel) => item.name)
        .sort()
        .join(' / ')}`;
    } else {
      description += `all languages`;
    }

    description += ', for ';

    if (this.args.filteredCourseStages[0]) {
      description += `stage ${this.args.filteredCourseStages
        .map((item: CourseStageModel) => item.name)
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
        .map((item: LanguageModel) => item.name)
        .sort()
        .join(' / ')}`;
    } else {
      title += `Languages: All`;
    }

    title += ' & ';

    if (this.args.filteredCourseStages[0]) {
      title += `Stage: ${this.args.filteredCourseStages
        .map((item: CourseStageModel) => item.name)
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
  handleCourseStageChange(stage: CourseStageModel | null) {
    if (!stage) {
      return;
    }

    this.router.transitionTo({ queryParams: { course_stage_slugs: stage.slug } });
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel | null) {
    if (!language) {
      return;
    }

    this.router.transitionTo({ queryParams: { languages: language.slug } });
  }

  @action
  handleSubmissionSelect(submission: SubmissionModel) {
    this.selectedSubmission = submission;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage': typeof AdminCourseSubmissionsPage;
  }
}
