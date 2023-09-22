import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryCourseStageModel } from './temporary-types';
import RepositoryStageListModel from 'codecrafters-frontend/models/repository-stage-list';

export default class RepositoryStageListItemModel extends Model {
  @belongsTo('repository-stage-list', { async: false }) declare list: RepositoryStageListModel;
  @belongsTo('course-stage', { async: false }) declare stage: TemporaryCourseStageModel;

  @attr('date') declare completedAt: Date | null; // If the user completed the stage, when they did
  @attr('boolean') declare isCurrent: boolean; // Whether this is the current stage
  @attr('boolean') declare isDisabled: boolean;
  @attr('number') declare position: number; // The position of the stage in the list

  get isBaseStage(): boolean {
    return this.stage.isBaseStage;
  }

  get isCompleted(): boolean {
    return this.completedAt !== null;
  }

  get isEnabled(): boolean {
    return !this.isDisabled;
  }

  get isExtensionStage(): boolean {
    return !this.isBaseStage;
  }
}
