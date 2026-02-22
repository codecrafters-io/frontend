import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import LanguageModel from 'codecrafters-frontend/models/language';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { type Section as MultiSectionCardSection } from 'codecrafters-frontend/components/course-page/multi-section-card';
import { Section, SectionList } from 'codecrafters-frontend/utils/pre-challenge-assessment-section-list';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onLanguageSelection: (language: LanguageModel) => void | Promise<boolean>;
    preferredLanguageSlug: string | undefined;
    repository: RepositoryModel;
    repositoryCreationErrorMessage?: string;
  };
}

export default class CreateRepositoryCard extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  @tracked expandedSectionIndex: number | null = null;

  constructor(owner: Owner, args: Signature['Args']) {
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
    const result = await this.args.onLanguageSelection(language);

    if (result === true) {
      this.expandNextSection();
    }
  }

  @action
  handleSectionExpanded(section: MultiSectionCardSection) {
    this.expandedSectionIndex = this.sectionList.indexOf(section as Section);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard': typeof CreateRepositoryCard;
  }
}
