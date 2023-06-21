import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CourseIdeaCardComponent extends Component {
  @service authenticator;
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
  async handleSupervoteButtonClick() {
    if (this.authenticator.isAnonymous) {
      this.authenticator.initiateLogin();

      return;
    }

    if (!this.userHasSupervotesAvailable) {
      return;
    }

    if (this.userHasVoted) {
      await this.args.courseIdea.supervote();
    } else {
      this.isVotingOrUnvoting = true;
      await Promise.all([this.args.courseIdea.vote(), this.args.courseIdea.supervote()]);
      this.isVotingOrUnvoting = false;
    }
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

  get userHasSupervoted() {
    return this.userSupervotesCount > 0;
  }

  get userHasSupervotesAvailable() {
    return this.authenticator.currentUser.availableCourseIdeaSupervotes > 0;
  }

  get userSupervotesCount() {
    if (this.authenticator.isAnonymous) {
      return 0;
    }

    return this.authenticator.currentUser.courseIdeaSupervotes.filterBy('courseIdea', this.args.courseIdea).length;
  }

  get userHasVotedOrSupervoted() {
    return this.userHasVoted || this.userHasSupervoted;
  }
}
