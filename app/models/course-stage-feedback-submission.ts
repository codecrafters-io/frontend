import Model from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';
import { TemporaryCourseStageModel, TemporaryLanguageModel, TemporaryRepositoryModel } from 'codecrafters-frontend/lib/temporary-types';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseStageFeedbackSubmissionModel extends Model {
  @belongsTo('course-stage', { async: false }) declare courseStage: TemporaryCourseStageModel;
  @belongsTo('language', { async: false }) declare language: TemporaryLanguageModel;
  @belongsTo('repository', { async: false }) declare repository: TemporaryRepositoryModel;
  @belongsTo('user', { async: false }) declare user: UserModel;

  @attr('date') declare createdAt: Date;
  @attr('boolean') declare isAcknowledgedByStaff: boolean;
  @attr('string') declare selectedAnswer: string;
  @attr('string') declare explanation: string | null;
  @attr('string') declare status: 'open' | 'closed' | 'reopened';

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
