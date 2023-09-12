import Model, { belongsTo } from '@ember-data/model';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

export default class CourseExtensionActivation extends Model {
  @belongsTo('course-extension', { async: false }) declare extension: CourseExtensionModel;
  @belongsTo('repository', { async: false }) declare repository: TemporaryRepositoryModel;
}
