import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type UserModel from 'codecrafters-frontend/models/user';

export default class CourseLanguageConfigurationModel extends Model {
  @attr() declare alphaTesterUsernames: Array<string>;
  @attr('string') declare releaseStatus: string;

  @belongsTo('course', { async: false, inverse: 'languageConfigurations' }) declare course: CourseModel;
  @belongsTo('language', { async: false, inverse: 'courseConfigurations' }) declare language: LanguageModel;

  @equal('releaseStatus', 'alpha') declare releaseStatusIsAlpha: boolean;
  @equal('releaseStatus', 'beta') declare releaseStatusIsBeta: boolean;
  @equal('releaseStatus', 'live') declare releaseStatusIsLive: boolean;

  isAvailableForUser(user: UserModel) {
    if (this.releaseStatusIsAlpha) {
      return user.isStaff || this.alphaTesterUsernames.includes(user.username) || user.isCourseAuthor(this.course);
    } else {
      return true;
    }
  }
}
