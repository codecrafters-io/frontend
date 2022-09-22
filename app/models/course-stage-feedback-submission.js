import { attr, belongsTo } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import Model from '@ember-data/model';

export default class CourseStageFeedbackSubmissionModel extends Model {
  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('language', { async: false }) language;
  @belongsTo('repository', { async: false }) repository;
  @belongsTo('user', { async: false }) user;

  @attr('string') selectedAnswer;
  @attr('string') explanation;
  @attr('string') status; // open, closed, reopened

  @equal('status', 'closed') statusIsClosed;
  @equal('status', 'open') statusIsOpen;
  @equal('status', 'reopened') statusIsReopened;

  get hasSelectedAnswer() {
    return !!this.selectedAnswer;
  }
}
