import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CourseIdeaCardComponent extends Component {
  @service('current-user') currentUserService;
  @service router;
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
    if (this.currentUserService.isAnonymous) {
      window.location.href = '/login?next=' + this.router.currentURL;
    }

    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;

    await this.args.courseIdea.supervote();

    if (!this.userHasVoted) {
      await this.args.courseIdea.vote();
    }

    this.isVotingOrUnvoting = false;
  }

  @action
  async handleVoteButtonClick() {
    if (this.currentUserService.isAnonymous) {
      window.location.href = '/login?next=' + this.router.currentURL;
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
    if (this.currentUserService.isAnonymous) {
      return false;
    }

    return this.currentUserService.record.courseIdeaVotes.mapBy('courseIdea').includes(this.args.courseIdea);
  }

  get userHasSupervoted() {
    return this.userSupervotesCount > 0;
  }

  get userSupervotesCount() {
    if (this.currentUserService.isAnonymous) {
      return 0;
    }

    return this.currentUserService.record.courseIdeaSupervotes.filterBy('courseIdea', this.args.courseIdea).length;
  }

  get userHasVotedOrSupervoted() {
    return this.userHasVoted || this.userHasSupervoted;
  }
}
