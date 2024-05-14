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

export default class UpvoteButtonComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUserHasUpvoted() {
    return this.args.solution.currentUserUpvotes.length > 0;
  }

  @action
  handleClick() {
    if (this.currentUserHasUpvoted) {
      this.args.solution.unvote({});
    } else {
      this.args.solution.upvote();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::UpvoteButton': typeof UpvoteButtonComponent;
  }
}
