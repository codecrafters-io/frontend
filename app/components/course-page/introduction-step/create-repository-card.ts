import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import LanguageModel from 'codecrafters-frontend/models/language';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RouterService from '@ember/routing/router-service';
import * as Sentry from '@sentry/ember';
import { type Section as MultiSectionCardSection } from 'codecrafters-frontend/components/course-page/multi-section-card';
import { Section, SectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
};

export default class CreateRepositoryCardComponent extends Component<Signature> {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  @tracked expandedSectionIndex: number | null = null;
  @tracked repositoryCreationErrorMessage: string | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    if (this.sectionList.firstIncompleteSection) {
      this.expandedSectionIndex = this.sectionList.indexOf(this.sectionList.firstIncompleteSection);
    }
  }

  get expandedSection(): Section | null {
    if (this.expandedSectionIndex === null) {
      return null;
    }

    return this.sectionList.sections[this.expandedSectionIndex] as Section;
  }

  get sectionList(): SectionList {
    return this.args.repository.preChallengeAssessmentSectionList;
  }

  @action
  expandNextSection(): void {
    if (this.expandedSectionIndex !== null) {
      this.expandedSectionIndex += 1;
    }
  }

  @action
  async handleLanguageSelection(language: LanguageModel) {
    this.repositoryCreationErrorMessage = null;
    this.args.repository.language = language;

    try {
      await this.args.repository.save(); // TODO: This is kinda slow, investigate ways to make it faster
    } catch (error) {
      this.args.repository.language = undefined;
      this.repositoryCreationErrorMessage =
        'Failed to create repository, please try again? Contact us at hello@codecrafters.io if this error persists.';
      Sentry.captureException(error);

      return;
    }

    this.expandNextSection();

    this.router.transitionTo({ queryParams: { repo: this.args.repository.id, track: null } });
  }

  @action
  handleSectionExpanded(section: MultiSectionCardSection) {
    this.expandedSectionIndex = this.sectionList.indexOf(section as Section);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard': typeof CreateRepositoryCardComponent;
  }
}
