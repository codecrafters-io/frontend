import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import PreferredLanguageLeaderboardService from 'codecrafters-frontend/services/preferred-language-leaderboard';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type Store from '@ember-data/store';
import { service } from '@ember/service';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    activeRepository: RepositoryModel;
    repositories: RepositoryModel[];
    track?: string;
    isExpanded: boolean;
    onCollapseButtonClick: () => void;
    onExpandButtonClick: () => void;
  };
}

export default class CoursePageRightSidebar extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;
  @service declare preferredLanguageLeaderboard: PreferredLanguageLeaderboardService;
  @service declare store: Store;
  @service declare featureFlags: FeatureFlagsService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get languageForTrackLeaderboard(): LanguageModel {
    if (this.args.activeRepository.language) {
      return this.args.activeRepository.language;
    }

    if (this.args.track) {
      const language = this.store.peekAll('language').find((language) => language.slug === this.args.track);

      if (language) {
        return language;
      }
    }

    for (const preferredLanguageSlug of this.preferredLanguageLeaderboard.preferredLanguageSlugs) {
      const language = this.store.peekAll('language').find((language) => language.slug === preferredLanguageSlug);

      if (language) {
        return language;
      }
    }

    return this.args.course.betaOrLiveLanguages[0]!;
  }

  get nextStagesInContextForTrackLeaderboard(): CourseStageModel[] {
    if (!this.coursePageState.stepList) {
      return [];
    }

    if (this.coursePageState.currentStep.type !== 'CourseStageStep') {
      return [];
    }

    if (this.coursePageState.currentStep !== this.coursePageState.activeStep) {
      return [];
    }

    return [
      this.coursePageState.currentStepAsCourseStageStep.courseStage,
      ...this.coursePageState.stepList
        .visibleStepsAfter(this.coursePageState.currentStep)
        .filter((step) => step.type === 'CourseStageStep')
        .map((step) => (step as CourseStageStep).courseStage),
    ];
  }

  get visiblePrivateLeaderboardFeatureSuggestion(): FeatureSuggestionModel | null {
    if (!this.currentUser || this.currentUser.isTeamMember) {
      return null;
    }

    return this.currentUser.featureSuggestions.filter((item) => item.featureIsPrivateLeaderboard).filter((item) => !item.isDismissed)[0] || null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::RightSidebar': typeof CoursePageRightSidebar;
  }
}
