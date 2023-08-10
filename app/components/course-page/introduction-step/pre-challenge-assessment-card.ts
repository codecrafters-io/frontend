// @ts-ignore
import { cached } from '@glimmer/tracking';

import { service } from '@ember/service';
import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: {
      course: {};
    };
  };
};

type RepositoryModel = {};

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
  @service declare coursePageState: CoursePageStateService;

  get expandedSection(): Section {
    return this.sections[0] as Section;
  }

  @cached
  get sections(): Section[] {
    return [
      new SelectLanguageSection(this.args.repository),
      new QuestionnaireQuestionSection(this.args.repository, 'git-push'),
      new QuestionnaireQuestionSection(this.args.repository, 'git-clone'),
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::PreChallengeAssessmentCard': typeof PreChallengeAssessmentCardComponent;
  }
}
