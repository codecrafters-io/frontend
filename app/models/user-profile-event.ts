import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

import type UserModel from 'codecrafters-frontend/models/user';

export default class UserProfileEvent extends Model {
  @attr('string') declare descriptionMarkdown: string;
  @attr('date') declare occurredAt: Date;
  @attr('string') declare type: 'CompletedCourseEvent' | 'CreatedAccountEvent' | 'StartedCourseEvent';

  @belongsTo('user', { async: false, inverse: 'profileEvents' }) declare user: UserModel;

  @equal('type', 'CompletedCourseEvent') declare isCompletedCourseEvent: boolean;
  @equal('type', 'CreatedAccountEvent') declare isCreatedAccountEvent: boolean;
  @equal('type', 'StartedCourseEvent') declare isStartedCourseEvent: boolean;
}
