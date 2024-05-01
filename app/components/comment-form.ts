import Component from '@glimmer/component';
import Prism from 'prismjs';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import type CourseStageCommentModel from 'codecrafters-frontend/models/course-stage-comment';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type CommunityCourseStageSolutionCommentModel from 'codecrafters-frontend/models/community-course-stage-solution-comment';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type LanguageModel from 'codecrafters-frontend/models/language';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    comment?: CourseStageCommentModel | CommunityCourseStageSolutionCommentModel;
    language?: LanguageModel | null;
    parentComment?: CourseStageCommentModel | CommunityCourseStageSolutionCommentModel | null;
    commentModelType: 'course-stage-comment' | 'community-course-stage-solution-comment';
    onCancel?: () => void;
    onSubmit?: () => void;
    target: CourseStageModel | CommunityCourseStageSolutionModel;
  };
};

export default class CommentFormComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  @tracked declare comment: CourseStageCommentModel | CommunityCourseStageSolutionCommentModel;
  @tracked isSaving = false;
  @tracked activeTab: 'write' | 'preview' = 'write';
  @tracked isEditingComment = false;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    if (this.args.comment) {
      this.comment = this.args.comment;
      this.isEditingComment = true;
    } else {
      this.setNewComment();
    }
  }

  get commentMarkdown() {
    return this.comment.bodyMarkdown || 'Nothing to preview';
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get isReplying() {
    return !!this.args.parentComment;
  }

  get placeholderText() {
    if (this.isReplying) {
      return 'Write a reply';
    } else {
      return 'Found an interesting resource? Share it with the community.';
    }
  }

  get submitButtonIsDisabled() {
    return !this.comment.bodyMarkdown || (this.comment.bodyMarkdown as unknown as string).trim().length < 1 || this.isSaving;
  }

  @action
  handleCancelReplyButtonClick() {
    if (this.args.onCancel) {
      this.args.onCancel();
    }
  }

  @action
  handleDidInsertBodyHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleEditCancelButtonClick() {
    if (this.args.onCancel) {
      this.args.onCancel();
    }
  }

  @action
  async handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    (e.target as HTMLFormElement).reportValidity();

    if ((e.target as HTMLFormElement).checkValidity()) {
      if (!this.args.comment) {
        this.comment.target = this.args.target || this.args.parentComment!.target;
      }

      this.isSaving = true;
      await this.comment.save();
      this.isSaving = false;

      if (this.args.onSubmit) {
        this.args.onSubmit();
      } else {
        this.setNewComment();
      }
    }
  }

  @action
  handleWillDestroy() {
    next(() => {
      if (this.isEditingComment) {
        this.comment.rollbackAttributes();
        // @ts-expect-error isNew isn't correctly typed
      } else if (this.comment.isNew && !this.comment.isSaving) {
        this.comment.unloadRecord();
      }
    });
  }

  @action
  setActiveTab(tab: 'write' | 'preview') {
    this.activeTab = tab;
  }

  setNewComment() {
    // TODO: We're setting target later since this interferes with the comment listing somehow
    if (this.args.parentComment) {
      this.comment = this.store.createRecord(this.args.commentModelType, {
        // target: this.args.parentComment.target,
        user: this.currentUser,
        language: this.args.parentComment.language,
        parentComment: this.args.parentComment,
      });
    } else {
      this.comment = this.store.createRecord(this.args.commentModelType, {
        // target: this.args.target,
        user: this.currentUser,
        language: this.args.language,
      });
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CommentForm: typeof CommentFormComponent;
  }
}
