import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { service } from '@ember/service';
import FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    activeRepository: RepositoryModel;
    repositories: RepositoryModel[];
    isExpanded: boolean;
    onCollapseButtonClick: () => void;
    onExpandButtonClick: () => void;
  };
}

export default class CoursePageRightSidebar extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare featureFlags: FeatureFlagsService;

  get currentUser() {
    return this.authenticator.currentUser;
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
