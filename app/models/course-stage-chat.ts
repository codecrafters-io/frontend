import Model, { belongsTo, hasMany } from '@ember-data/model';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type CourseStageChatMessageModel from 'codecrafters-frontend/models/course-stage-chat-message';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export default class CourseStageChatModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: null }) declare courseStage: CourseStageModel;
  @belongsTo('repository', { async: false, inverse: null }) declare repository: RepositoryModel;

  @hasMany('course-stage-chat-message', { async: false, inverse: 'chat' }) declare messages: CourseStageChatMessageModel[];
}
