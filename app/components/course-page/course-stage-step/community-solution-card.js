import Component from '@glimmer/component';
import Prism from 'prismjs';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { groupBy } from 'codecrafters-frontend/lib/lodash-utils';

export default class CommunitySolutionCardComponent extends Component {
  @tracked isExpanded = false;
  @tracked isLoadingComments = false;
  @tracked containerElement;
  @service store;
  @service authenticator;
  @service analyticsEventTracker;

  get changedFilesForRender() {
    return this.args.solution.changedFiles.map((changedFile) => {
      return {
        ...changedFile,
        comments: this.shouldShowComments ? this.commentsGroupedByFilename[changedFile.filename] || [] : [],
      };
    });
  }

  get comments() {
    return this.args.solution.comments.filter((comment) => comment.isTopLevelComment && !comment.isNew);
  }

  get commentsGroupedByFilename() {
    return groupBy(this.comments, 'filename');
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  // get debug() {
  //   return JSON.stringify({
  //     all: this.store.peekAll('community-course-stage-solution-comment').length,
  //     solutionComments: this.args.solution.comments.length,
  //     shouldShowComments: this.shouldShowComments,
  //   });
  // }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get isCollapsedByDefault() {
    return this.args.isCollapsedByDefault; // TODO: Compute based on lines of code
  }

  get isCurrentUserSolution() {
    return this.currentUser.id === this.args.solution.user.id;
  }

  get shouldShowComments() {
    return this.comments.length > 0;
  }

  get shouldShowExplanation() {
    return this.isExpanded && this.explanationHTML && this.authenticator.currentUser.isStaff;
  }

  get shouldShowPublishToGithubButton() {
    return this.isCurrentUserSolution && !this.args.solution.isPublishedToGithub;
  }

  @action
  handleCollapseButtonClick() {
    this.isExpanded = false;
    this.containerElement.scrollIntoView({ behavior: 'smooth' });
  }

  @action
  handleCommentView(comment) {
    this.analyticsEventTracker.track('viewed_comment', {
      comment_id: comment.id,
    });
  }

  @action
  handleDidInsert(element) {
    this.containerElement = element;
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
  handleExpandButtonClick() {
    this.isExpanded = true;
    this.loadComments();

    this.analyticsEventTracker.track('viewed_community_course_stage_solution', {
      community_course_stage_solution_id: this.args.solution.id,
      position_in_list: this.args.positionInList,
    });
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
}
