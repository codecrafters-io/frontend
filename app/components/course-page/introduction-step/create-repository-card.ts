import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RouterService from '@ember/routing/router-service';
import { Section as MultiSectionCardSection } from 'codecrafters-frontend/components/course-page/multi-section-card';
import { Section, SectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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

export default class CreateRepositoryCardComponent extends Component<Signature> {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  @tracked expandedSectionIndex: number = 0;

  get expandedSection(): Section {
    return this.sectionList.sections[this.expandedSectionIndex] as Section;
  }

  @action
  async handleExpectedActivityFrequencySelection() {
    this.expandedSectionIndex += 1;
  }

  @action
  async handleLanguageSelection(language: unknown) {
    // @ts-ignore
    this.args.repository.language = language;
    this.expandedSectionIndex = 1;

    await this.args.repository.save();
    this.router.transitionTo({ queryParams: { repo: this.args.repository.id, track: null } });
  }

  @action
  async handleRemindersPreferenceSelection(remindersAreEnabled: boolean) {
    // @ts-ignore
    this.args.repository.remindersAreEnabled = remindersAreEnabled;
    await this.args.repository.save();
  }

  @action
  handleSectionExpanded(section: MultiSectionCardSection) {
    this.expandedSectionIndex = this.sectionList.indexOf(section as Section);
  }

  get sectionList(): SectionList {
    // @ts-ignore
    return this.args.repository.preChallengeAssessmentSectionList;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard': typeof CreateRepositoryCardComponent;
  }
}
