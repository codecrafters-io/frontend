import { action } from '@ember/object';

// @ts-ignore
import { cached } from '@glimmer/tracking';

import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RouterService from '@ember/routing/router-service';

type RepositoryModel = {
  id: null | string;
  save(): Promise<void>;
};

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
};

class QuestionnaireQuestionSection {
  repository: RepositoryModel;
  questionSlug: string;

  constructor(repository: RepositoryModel, questionSlug: string) {
    this.repository = repository;
    this.questionSlug = questionSlug;
  }

  get collapsedTitle() {
    return 'Questionnaire';
  }

  get isComplete() {
    return false;
  }

  get title() {
    return `Question ${this.questionSlug}`;
  }
}

class SelectLanguageSection {
  repository: RepositoryModel;

  constructor(repository: RepositoryModel) {
    this.repository = repository;
  }

  get collapsedTitle() {
    return 'Preferred Language';
  }

  get isComplete() {
    // @ts-ignore
    return !!this.repository.language;
  }

  get title() {
    return 'Preferred Language';
  }
}

type Section = SelectLanguageSection | QuestionnaireQuestionSection;

export default class PreChallengeAssessmentCardComponent extends Component<Signature> {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  @tracked expandedSectionIndex: number = 0;

  get expandedSection(): Section {
    return this.sections[this.expandedSectionIndex] as Section;
  }

  @action
  async handleLanguageSelection(language: unknown) {
    // @ts-ignore
    this.args.repository.language = language;
    await this.args.repository.save();
    this.router.transitionTo({ queryParams: { repo: this.args.repository.id, track: null } });
    this.expandedSectionIndex = 1;
  }

  @action
  handleSectionExpanded(section: Section) {
    this.expandedSectionIndex = this.sections.indexOf(section);
  }

  @cached
  get sections(): Section[] {
    return [
      new SelectLanguageSection(this.args.repository),
      new QuestionnaireQuestionSection(this.args.repository, 'git-push'),
      new QuestionnaireQuestionSection(this.args.repository, 'git-clone'),
    ];
  }

  get selectLanguageSection(): SelectLanguageSection {
    return this.sections[0] as SelectLanguageSection;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::PreChallengeAssessmentCard': typeof PreChallengeAssessmentCardComponent;
  }
}
