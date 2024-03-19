import Model, { attr, belongsTo } from '@ember-data/model';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import RepositoryModel from 'codecrafters-frontend/models/repository';

export default class CourseExtensionActivation extends Model {
  @belongsTo('course-extension', { async: false, inverse: null }) declare extension: CourseExtensionModel;
  @belongsTo('repository', { async: false, inverse: 'extensionActivations' }) declare repository: RepositoryModel;

  @attr('date') declare activatedAt: Date;
}
