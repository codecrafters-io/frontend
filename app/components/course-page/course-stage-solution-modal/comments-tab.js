import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CommentsTabComponent extends Component {
  @tracked isLoading = true;
  @service store;
  @service('current-user') currentUserService;

  constructor() {
    super(...arguments);

    this.loadComments();
  }

  get currentUserIsStaff() {
    return this.currentUserService.record.isStaff;
  }

  @action
  async loadComments() {
    this.isLoading = true;

    await this.store.query('course-stage-comment', {
      course_stage_id: this.args.courseStage.id,
      include: 'user,language,course-stage,current-user-upvotes,current-user-downvotes,current-user-upvotes.user,current-user-downvotes.user',
    });

    this.isLoading = false;
  }

  get sortedComments() {
    return this.visibleComments.sortBy('createdAt').reverse();
  }

  get visibleComments() {
    if (this.currentUserIsStaff) {
      return this.args.courseStage.comments.rejectBy('isNew');
    } else {
      return this.args.courseStage.comments
        .rejectBy('isNew')
        .filter((comment) => comment.isApprovedByModerator || comment.user === this.currentUserService.record);
    }
  }
}
