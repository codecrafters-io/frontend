import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunityCourseStageSolution from 'codecrafters-frontend/models/community-course-stage-solution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    changedFile: CommunityCourseStageSolution['changedFiles'][number];
    onPublishToGithubButtonClick: () => void;
    solution: CommunityCourseStageSolution;
  };
}

export default class ChangedFileCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get shouldShowPublishToGithubButton(): boolean {
    return this.args.solution.user.id === this.authenticator.currentUser?.id && !this.args.solution.isPublishedToPublicGithubRepository;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::ChangedFileCard': typeof ChangedFileCardComponent;
  }
}
