import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CommentsTabComponent extends Component {
  @tracked isLoading = true;
  @service store;

  constructor() {
    super(...arguments);

    this.loadComments();
  }

  @action
  async loadComments() {
    this.isLoading = true;

    await this.store.query('course-stage-comment', {
      course_stage_id: this.args.courseStage.id,
      include: 'user,language,course-stage',
    });

    this.isLoading = false;
  }

  get sortedComments() {
    return this.args.courseStage.comments.rejectBy('isNew').sortBy('createdAt').reverse();
  }
}
