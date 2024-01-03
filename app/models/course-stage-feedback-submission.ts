import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import LanguageModel from 'codecrafters-frontend/models/language';
import Model from '@ember-data/model';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import UserModel from 'codecrafters-frontend/models/user';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseStageFeedbackSubmissionModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: null }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('repository', { async: false }) declare repository: RepositoryModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

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
