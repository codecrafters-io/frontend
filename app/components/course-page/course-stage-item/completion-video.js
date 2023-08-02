import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import Player from '@vimeo/player';

export default class CompletionVideoComponent extends Component {
  @service analyticsEventTracker;

  trackedPercentages = new Set();

  @action
  setupVimeoPlayer(element) {
    let player = new Player(element.querySelector('iframe'));

    player.on('play', (eventData) => {
      this.analyticsEventTracker.track('started_stage_completion_video', {
        course_stage_slug: this.args.courseStage.slug,
        course_slug: this.args.courseStage.course.slug,
        played_percentage: eventData.percent * 100,
        played_time_in_seconds: eventData.seconds,
      });
    });

    player.on('timeupdate', (eventData) => {
      const playedPercentage = eventData.percent * 100;
      const roundedPercentage = playedPercentage - (playedPercentage % 10);

      if (this.trackedPercentages.has(roundedPercentage) || roundedPercentage === 0) {
        return;
      }

      this.analyticsEventTracker.track('viewed_stage_completion_video', {
        course_stage_slug: this.args.courseStage.slug,
        course_slug: this.args.courseStage.course.slug,
        played_percentage: roundedPercentage,
        played_time_in_seconds: eventData.seconds,
      });

      this.trackedPercentages.add(roundedPercentage);
    });

    player.on('pause', (eventData) => {
      this.analyticsEventTracker.track('paused_stage_completion_video', {
        course_stage_slug: this.args.courseStage.slug,
        course_slug: this.args.courseStage.course.slug,
        played_percentage: eventData.percent * 100,
        played_time_in_seconds: eventData.seconds,
      });
    });
  }
}
