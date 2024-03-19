import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import Model, { attr, belongsTo } from '@ember-data/model';
import RepositoryStageListModel from 'codecrafters-frontend/models/repository-stage-list';

export default class RepositoryStageListItemModel extends Model {
  @belongsTo('repository-stage-list', { async: false, inverse: 'items' }) declare list: RepositoryStageListModel;
  @belongsTo('course-stage', { async: false, inverse: null }) declare stage: CourseStageModel;

  @attr('date') declare completedAt: Date | null; // If the user completed the stage, when they did
  @attr('boolean') declare isCurrent: boolean; // Whether this is the current stage
  @attr('number') declare position: number; // The position of the stage in the list

  get isBaseStage(): boolean {
    return this.stage.isBaseStage;
  }

  get isCompleted(): boolean {
    return this.completedAt !== null;
  }

  get isExtensionStage(): boolean {
    return !this.isBaseStage;
  }
}
