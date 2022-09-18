import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CourseIdeaCardComponent extends Component {
  @service('current-user') currentUserService;
  @service router;
  @service store;

  get userHasVoted() {
    if (this.currentUserService.isAnonymous) {
      return false;
    }

    return this.currentUserService.record.courseIdeaVotes.mapBy('courseIdea').includes(this.args.courseIdea);
  }

  get userHasSupervoted() {
    if (this.currentUserService.isAnonymous) {
      return false;
    }

    return this.currentUserService.record.courseIdeaSupervotes.mapBy('courseIdea').includes(this.args.courseIdea);
  }

  get userHasVotedOrSupervoted() {
    return this.userHasVoted || this.userHasSupervoted;
  }
}
