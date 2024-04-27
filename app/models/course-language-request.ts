import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';

import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type UserModel from 'codecrafters-frontend/models/user';

export default class CourseLanguageRequestModel extends Model {
  @belongsTo('course', { async: false, inverse: null }) declare course: CourseModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('user', { async: false, inverse: 'courseLanguageRequests' }) declare user: UserModel;
}
