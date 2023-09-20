import Model from '@ember-data/model';
import { TemporaryCourseStageModel, TemporaryLanguageModel, TemporaryRepositoryModel, TemporaryUserModel } from './temporary-types';
import { attr, belongsTo } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import showdown from 'showdown';

export default class CourseStageFeedbackSubmissionModel extends Model {
  @belongsTo('course-stage', { async: false }) declare courseStage: TemporaryCourseStageModel;
  @belongsTo('language', { async: false }) declare language: TemporaryLanguageModel;
  @belongsTo('repository', { async: false }) declare repository: TemporaryRepositoryModel;
  @belongsTo('user', { async: false }) declare user: TemporaryUserModel;

  @attr('boolean') declare isAcknowledgedByStaff: boolean;
  @attr('string') declare selectedAnswer: string;
  @attr('string') declare explanation: string | null;
  @attr('string') declare status: 'open' | 'closed' | 'reopened';

  // This isn't really "markdown", but rendering as HTML makes it cleaner to view
  get explanationHTML() {
    if (!this.explanation) {
      return '';
    }

    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.explanation));
  }

  get hasSelectedAnswer() {
    return !!this.selectedAnswer;
  }

  get statusIsClosed() {
    return this.status === 'closed';
  }

  get statusIsOpen() {
    return this.status === 'open';
  }

  get statusIsReopened() {
    return this.status === 'reopened';
  }
}
