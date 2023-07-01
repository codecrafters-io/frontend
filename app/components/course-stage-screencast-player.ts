import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import playerjs from 'player.js';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    screencast: { embedHtml: string; originalUrl: string };
  };
}

export default class CourseStageScreencastPlayer extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | undefined;

  @action
  handleDidInsertContainer(element: HTMLDivElement) {
    this.containerElement = element;
    this.installListeners();
  }

  @action
  handleDidUpdateScreencast(element: HTMLDivElement) {
    this.containerElement = element;
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
        player.on('play', (playEvent: any) => {
          console.log('play', playEvent);
        });

        player.on('pause', (pauseEvent: any) => {
          console.log('pause', pauseEvent);
        });
      });
    });
  }
}
