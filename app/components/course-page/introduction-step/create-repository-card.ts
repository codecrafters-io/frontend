import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RouterService from '@ember/routing/router-service';
import { Section as MultiSectionCardSection } from 'codecrafters-frontend/components/course-page/multi-section-card';
import { Section, SectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import { TemporaryLanguageModel, TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: TemporaryRepositoryModel;
  };
};

export default class CreateRepositoryCardComponent extends Component<Signature> {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  @tracked expandedSectionIndex: number | null = null;

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
  async handleLanguageSelection(language: TemporaryLanguageModel) {
    this.args.repository.language = language;

    await this.args.repository.save(); // TODO: This is kinda slow, investigate ways to make it faster
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
