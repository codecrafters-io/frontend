import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class VoteButtonComponent extends Component {
  @service('current-user') currentUserService;
  @service router;
  @service store;

  @tracked isVotingOrUnvoting = false;

  @action
  async handleClick() {
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
      await this.store.createRecord('course-idea-vote', { courseIdea: this.args.courseIdea, user: this.currentUserService.record }).save();
    }

    this.isVotingOrUnvoting = false;
  }

  get userHasVoted() {
    if (this.currentUserService.isAnonymous) {
      return false;
    }

    return this.currentUserService.record.courseIdeaVotes.mapBy('courseIdea').includes(this.args.courseIdea);
  }
}
