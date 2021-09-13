import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import LeaderboardPoller from 'codecrafters-frontend/lib/leaderboard-poller';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageLeaderboardComponent extends Component {
  transition = fade;
  @tracked isLoadingEntries = true;
  @tracked entries;
  @tracked polledCourse;
  @service store;
  @service visibility;

  @action
  async handleDidInsert() {
    this.entries = await this.store.query('leaderboard-entry', {
      course_id: this.args.course.id,
      include: 'language,active-course-stage,user',
    });

    this.isLoadingEntries = false;
    this.startLeaderboardPoller();
  }

  @action
  async handleWillDestroy() {
    this.stopRepositoryPoller();
  }

  @action
  async handlePoll(entries) {
    this.entries = entries;
  }

  startLeaderboardPoller() {
    this.stopLeaderboardPoller();
    this.leaderboardPoller = new LeaderboardPoller({ store: this.store, visibilityService: this.visibility });
    this.leaderboardPoller.start(this.args.course, this.handlePoll);
    this.polledCourse = this.args.course;
  }

  stopLeaderboardPoller() {
    if (this.leaderboardPoller) {
      this.leaderboardPoller.stop();
    }

    this.polledCourse = null;
  }
}
