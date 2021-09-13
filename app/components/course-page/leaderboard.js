import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageLeaderboardComponent extends Component {
  transition = fade;
  @tracked isLoadingEntries = true;
  @tracked entries;
  @service store;

  @action
  async handleDidInsertLoadingIndicator() {
    console.log(this.args.course);
    this.entries = await this.store.query('leaderboard-entry', {
      course_id: this.args.course.id,
      include: 'language,highest-completed-course-stage,user',
    });

    this.isLoadingEntries = false;
  }
}
