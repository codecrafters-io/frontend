import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

type Signature = {
  Element: HTMLButtonElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
  };
};

export default class DownvoteButtonComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUserHasDownvoted() {
    return this.args.solution.currentUserDownvotes.length > 0;
  }

  @action
  handleClick() {
    if (this.currentUserHasDownvoted) {
      this.args.solution.unvote({});
    } else {
      this.args.solution.downvote();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::DownvoteButton': typeof DownvoteButtonComponent;
  }
}
