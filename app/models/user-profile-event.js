import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

export default class UserProfileEvent extends Model {
  @attr('string') type;
  @attr('string') descriptionMarkdown;
  @attr('date') occurredAt;

  @belongsTo('user', { async: false, inverse: 'profileEvents' }) user;

  @equal('type', 'CreatedAccountEvent') isCreatedAccountEvent;
  @equal('type', 'StartedCourseEvent') isStartedCourseEvent;
  @equal('type', 'CompletedCourseEvent') isCompletedCourseEvent;
}
