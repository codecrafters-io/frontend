import Model, { attr, belongsTo } from '@ember-data/model';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { collectionAction } from 'ember-api-actions';

export default class CourseExtensionActivation extends Model {
  @belongsTo('course-extension', { async: false, inverse: null }) declare extension: CourseExtensionModel;
  @belongsTo('repository', { async: false, inverse: 'extensionActivations' }) declare repository: RepositoryModel;

  @attr('date') declare activatedAt: Date;
  @attr('number') declare position: number;

  declare reorder: (
    this: Model,
    payload: { repository_id: string; positions: Array<{ id: string; position: number }> }
  ) => Promise<void>;
}

CourseExtensionActivation.prototype.reorder = collectionAction({
  path: 'reorder',
  type: 'post',
});
