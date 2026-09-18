import Model, { attr, belongsTo } from '@ember-data/model';
import type CourseStageChatModel from 'codecrafters-frontend/models/course-stage-chat';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export default class CourseStageChatMessageModel extends Model {
  @belongsTo('course-stage-chat', { async: false, inverse: 'messages' }) declare chat: CourseStageChatModel | null;
  @belongsTo('course-stage', { async: false, inverse: null }) declare courseStage: CourseStageModel;
  @belongsTo('repository', { async: false, inverse: null }) declare repository: RepositoryModel;

  @attr('string') declare body: string;
  @attr('date') declare createdAt: Date;
  @attr('string') declare inputMode: string;
  @attr('string') declare rating: 'up' | 'down' | null;
  @attr('boolean') declare refused: boolean;
  @attr() declare researchSourceNames: string[] | undefined;
  @attr('string') declare role: 'user' | 'assistant';
  @attr('string') declare status: 'pending' | 'complete' | null;

  get isAssistant(): boolean {
    return this.role === 'assistant';
  }

  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isUser(): boolean {
    return this.role === 'user';
  }
}
