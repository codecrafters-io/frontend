import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TrackPageIntroductionAndCoursesComponent extends Component {
  @service currentUser;

  get userHasStartedTrack() {
    return this.currentUser.record.repositories.filterBy('language', this.args.language).filterBy('lastSubmissionAt').firstObject;
  }
}
