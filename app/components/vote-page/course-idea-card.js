import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CourseIdeaCardComponent extends Component {
  @service authenticator;
  @service store;

  @tracked isVotingOrUnvoting = false;

  @action
  async handleUnvoteButtonClick() {
    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;
    await this.args.courseIdea.unvote();
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
      await this.args.courseIdea.unvote();
    } else {
      await this.args.courseIdea.vote();
    }

    this.isVotingOrUnvoting = false;
  }

  get userHasVoted() {
    if (this.authenticator.isAnonymous) {
      return false;
    }

    return this.authenticator.currentUser.courseIdeaVotes.mapBy('courseIdea').includes(this.args.courseIdea);
  }

  get userHasVotedOrSupervoted() {
    return this.userHasVoted || this.userHasSupervoted;
  }
}
