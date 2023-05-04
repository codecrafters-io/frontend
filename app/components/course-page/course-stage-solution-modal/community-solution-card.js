import Component from '@glimmer/component';
import Prism from 'prismjs';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class CommunitySolutionCardComponent extends Component {
  @tracked isExpanded = false;
  @tracked isLoadingComments = false;
  @tracked containerElement;
  @service store;
  @service('current-user') currentUserService;

  get comments() {
    return this.args.solution.comments.filter((comment) => !comment.parentComment);
  }

  get explanationHTML() {
    if (this.args.solution.explanationMarkdown) {
      return htmlSafe(new showdown.Converter().makeHtml(this.args.solution.explanationMarkdown));
    } else {
      return null;
    }
  }

  @action
  handleDidInsert(element) {
    this.containerElement = element;
  }

  @action
  handleExpandButtonClick() {
    this.isExpanded = true;
    this.loadComments();

    this.store
      .createRecord('analytics-event', {
        name: 'viewed_community_course_stage_solution',
        properties: {
          community_course_stage_solution_id: this.args.solution.id,
        },
      })
      .save();
  }

  @action
  handleCollapseButtonClick() {
    this.isExpanded = false;
    this.containerElement.scrollIntoView({ behavior: 'smooth' });
  }

  @action
  handleDidInsertExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  async loadComments() {
    this.isLoadingComments = true;

    await this.store.query('community-course-stage-solution-comment', {
      target_id: this.args.solution.id,
      include:
        'user,language,target,current-user-upvotes,current-user-downvotes,current-user-upvotes.user,current-user-downvotes.user,parent-comment',
      reload: true,
    });

    this.isLoadingComments = false;
  }

  get isCollapsedByDefault() {
    return this.args.isCollapsedByDefault; // TODO: Compute based on lines of code
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get shouldShowComments() {
    return this.isExpanded && this.comments.length > 0 && this.currentUserService.record.isStaff;
  }

  get shouldShowExplanation() {
    return this.isExpanded && this.explanationHTML && this.currentUserService.record.isStaff;
  }
}
