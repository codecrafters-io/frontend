import Component from '@glimmer/component';
import Prism from 'prismjs';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';
import { groupBy } from '../../../lib/lodash-utils';

export default class CommunitySolutionCardComponent extends Component {
  @tracked isExpanded = false;
  @tracked isLoadingComments = false;
  @tracked containerElement;
  @service store;
  @service('current-user') currentUserService;

  get changedFilesForRender() {
    return this.args.solution.changedFiles.map((changedFile) => {
      return {
        ...changedFile,
        comments: this.shouldShowComments ? this.commentsGroupedByFilename[changedFile.filename] || [] : [],
      };
    });
  }

  get commentsGroupedByFilename() {
    return groupBy(this.comments, 'filename');
  }

  get comments() {
    return this.args.solution.comments.filter((comment) => comment.isTopLevelComment && !comment.isNew);
  }

  // get debug() {
  //   return JSON.stringify({
  //     all: this.store.peekAll('community-course-stage-solution-comment').length,
  //     solutionComments: this.args.solution.comments.length,
  //     shouldShowComments: this.shouldShowComments,
  //   });
  // }

  get explanationHTML() {
    if (this.args.solution.explanationMarkdown) {
      return htmlSafe(new showdown.Converter().makeHtml(this.args.solution.explanationMarkdown));
    } else {
      return null;
    }
  }

  @action
  handleCommentView(comment) {
    this.store
      .createRecord('analytics-event', {
        name: 'viewed_comment',
        properties: {
          comment_id: comment.id,
        },
      })
      .save();
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
          position_in_list: this.args.positionInList,
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
    return this.isExpanded && this.comments.length > 0;
  }

  get shouldShowExplanation() {
    return this.isExpanded && this.explanationHTML && this.currentUserService.record.isStaff;
  }
}
