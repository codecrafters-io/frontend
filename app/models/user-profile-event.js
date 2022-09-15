import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, belongsTo } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { htmlSafe } from '@ember/template';

export default class UserProfileEvent extends Model {
  @attr('string') type;
  @attr('string') descriptionMarkdown;
  @attr('date') occurredAt;

  @belongsTo('user', { async: false }) user;

  @equal('type', 'CreatedAccountEvent') isCreatedAccountEvent;
  @equal('type', 'StartedCourseEvent') isStartedCourseEvent;
  @equal('type', 'CompletedCourseEvent') isCompletedCourseEvent;

  get descriptionHTML() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }
}
