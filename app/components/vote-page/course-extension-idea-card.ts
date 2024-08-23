import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courseExtensionIdea: CourseExtensionIdeaModel;
  };
}

export default class CourseIdeaCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked isVotingOrUnvoting = false;

  get userHasVoted() {
    if (this.authenticator.isAnonymous) {
      return false;
    }

    return this.authenticator.currentUser!.courseExtensionIdeaVotes.mapBy('courseExtensionIdea').includes(this.args.courseExtensionIdea);
  }

  @action
  async handleUnvoteButtonClick() {
    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;
    await this.args.courseExtensionIdea.unvote({});
    this.isVotingOrUnvoting = false;
  }

  @action
  async handleVoteButtonClick() {
    if (this.authenticator.isAnonymous) {
      this.authenticator.initiateLogin(null);

      return;
    }

    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;

    if (this.userHasVoted) {
      await this.args.courseExtensionIdea.unvote({});
    } else {
      await this.args.courseExtensionIdea.vote();
    }

    this.isVotingOrUnvoting = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'VotePage::CourseExtensionIdeaCard': typeof CourseIdeaCardComponent;
  }
}
