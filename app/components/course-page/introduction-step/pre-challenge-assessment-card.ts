import { action } from '@ember/object';

// @ts-ignore
import { cached } from '@glimmer/tracking';

import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RouterService from '@ember/routing/router-service';

import { Section as MultiSectionCardSection } from 'codecrafters-frontend/components/course-page/multi-section-card';
import { Section, SectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';

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

export default class PreChallengeAssessmentCardComponent extends Component<Signature> {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  @tracked expandedSectionIndex: number = 0;

  get expandedSection(): Section {
    return this.sectionList.sections[this.expandedSectionIndex] as Section;
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
    'CoursePage::IntroductionStep::PreChallengeAssessmentCard': typeof PreChallengeAssessmentCardComponent;
  }
}
