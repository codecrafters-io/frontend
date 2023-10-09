import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CourseIdeaCardComponent extends Component {
  @service authenticator;
  @service store;

  @tracked isVotingOrUnvoting = false;

  get userHasVoted() {
    if (this.authenticator.isAnonymous) {
      return false;
    }

    return this.authenticator.currentUser.courseExtensionIdeaVotes.mapBy('courseExtensionIdea').includes(this.args.courseExtensionIdea);
  }

  @action
  async handleUnvoteButtonClick() {
    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;
    await this.args.courseExtensionIdea.unvote();
    this.isVotingOrUnvoting = false;
  }

  @action
  async handleVoteButtonClick() {
    if (this.authenticator.isAnonymous) {
      this.authenticator.initiateLogin();

      return;
    }

    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;

    if (this.userHasVoted) {
      await this.args.courseExtensionIdea.unvote();
    } else {
      await this.args.courseExtensionIdea.vote();
    }

    this.isVotingOrUnvoting = false;
  }
}
