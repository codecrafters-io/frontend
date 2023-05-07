import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DownvoteButtonComponent extends Component {
  @service store;

  get currentUserHasDownvoted() {
    return this.args.comment.currentUserDownvotes.length > 0;
  }

  @action
  handleClick() {
    if (this.currentUserHasDownvoted) {
      this.args.comment.unvote();
    } else {
      this.args.comment.downvote();
    }
  }
}
