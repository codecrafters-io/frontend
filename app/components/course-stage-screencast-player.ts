import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import playerjs from 'player.js';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    screencast: { embedHtml: string; originalUrl: string; id: string };
  };
}

export default class CourseStageScreencastPlayer extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | undefined;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  playedTimeInSeconds: number | undefined;
  totalDurationInSeconds: number | undefined;

  @action
  handleDidInsertContainer(element: HTMLDivElement) {
    this.containerElement = element;
    this.installListeners();
  }

  @action
  handleDidUpdateScreencast(element: HTMLDivElement) {
    this.containerElement = element;
    this.playedTimeInSeconds = undefined;
    this.totalDurationInSeconds = undefined;
    this.installListeners();
  }

  @action
  installListeners() {
    const iframe = this.containerElement!.querySelector('iframe');

    if (!iframe) {
      later(this.installListeners, 100);
      return;
    }

    iframe.addEventListener('load', () => {
      const player = new playerjs.Player(iframe);

      player.on('ready', () => {
        player.on('timeupdate', (data: { seconds: number; duration: number }) => {
          this.playedTimeInSeconds = data.seconds;
          this.totalDurationInSeconds = data.duration;
        });

        player.on('play', () => {
          this.analyticsEventTracker.track('played_screencast', { screencast_id: this.args.screencast.id });
        });

        player.on('pause', () => {
          this.analyticsEventTracker.track('paused_screencast', {
            screencast_id: this.args.screencast.id,
            played_percentage:
              this.playedTimeInSeconds && this.totalDurationInSeconds ? (this.playedTimeInSeconds / this.totalDurationInSeconds) * 100 : -1,
            played_time_in_seconds: this.playedTimeInSeconds && this.totalDurationInSeconds ? this.playedTimeInSeconds : -1,
          });
        });
      });
    });
  }
}
