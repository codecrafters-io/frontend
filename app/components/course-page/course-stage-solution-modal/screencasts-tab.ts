import Component from '@glimmer/component';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { createPopup } from '@typeform/embed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courseStage: {
      slug: string;
      course: {
        slug: string;
      };
      screencasts: {
        id: string;
      }[];
    };
  };
}

export default class ScreencastsTabComponent extends Component<Signature> {
  @tracked embedHtml: string | undefined;
  @tracked selectedScreencast: any | undefined;
  @tracked screencastPlayerElement: HTMLDivElement | undefined;

  // @ts-ignore
  @service declare authenticator;

  @service declare store: Store;

  get screencasts() {
    return this.args.courseStage.screencasts;
  }

  get screencastsForList() {
    return this.screencasts.filter((screencast) => screencast !== this.selectedScreencast);
  }

  @action
  handleScreencastClicked(screencast: any) {
    this.selectedScreencast = screencast;

    next(() => {
      if (this.screencastPlayerElement) {
        this.screencastPlayerElement.scrollIntoView();
      }
    });
  }

  @action
  handleSubmitScreencastButtonClicked() {
    createPopup('Dl5342qZ', {
      hidden: {
        github_username: this.authenticator.currentUser.username,
        course_slug: this.args.courseStage.course.slug,
        course_stage_slug: this.args.courseStage.slug,
      },
    }).toggle();
  }

  @action
  async handleDidInsertScreencastPlayer(element: HTMLDivElement) {
    this.screencastPlayerElement = element;
  }
}
