import Model, { attr, belongsTo } from '@ember-data/model';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

export default class CourseExtensionActivation extends Model {
  @belongsTo('course-extension', { async: false, inverse: null }) declare extension: CourseExtensionModel;
  @belongsTo('repository', { async: false, inverse: 'courseExtensionActivations' }) declare repository: TemporaryRepositoryModel;

  @attr('date') declare activatedAt: Date;
}
