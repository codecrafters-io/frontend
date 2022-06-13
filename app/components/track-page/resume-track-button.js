import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class CourseOverviewResumeTrackButtonComponent extends Component {
  @service router;

  @action
  handleClicked() {
    // TODO: Handle "resume-track functionality?"
    this.router.transitionTo('course', this.args.courses.firstObject.slug);
  }
}
