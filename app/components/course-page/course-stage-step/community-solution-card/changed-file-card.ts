import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunityCourseStageSolution from 'codecrafters-frontend/models/community-course-stage-solution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    changedFile: CommunityCourseStageSolution['changedFiles'][number];
    solution: CommunityCourseStageSolution;
  };
}

export default class ChangedFileCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get shouldShowPublishToGithubButton(): boolean {
    return this.args.solution.user.id === this.authenticator.currentUser?.id && !this.args.solution.isPublishedToPublicGithubRepository;
  }

  @action
  handlePublishToGithubButtonClick(): void {
    // TODO: Implement publish to GitHub functionality
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::ChangedFileCard': typeof ChangedFileCardComponent;
  }
}
