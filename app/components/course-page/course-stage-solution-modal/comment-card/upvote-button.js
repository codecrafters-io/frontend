import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class UpvoteButtonComponent extends Component {
  @service store;

  get currentUserHasUpvoted() {
    return this.args.comment.currentUserUpvotes.length > 0;
  }

  @action
  handleClick() {
    if (this.currentUserHasUpvoted) {
      this.args.comment.unvote();
    } else {
      this.args.comment.upvote();
    }
  }
}
