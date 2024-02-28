import Controller from '@ember/controller';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import CourseStageScreencastModel from 'codecrafters-frontend/models/course-stage-screencast';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { createPopup } from '@typeform/embed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

type ModelType = {
  courseStage: CourseStageModel;
  activeRepository: RepositoryModel;
};

export default class ScreencastsTabComponent extends Controller {
  queryParams = ['selectedScreencastId'];

  declare model: ModelType;

  @tracked embedHtml: string | undefined;
  @tracked selectedScreencastId: string | undefined;
  @tracked screencastPlayerElement: HTMLDivElement | undefined;

  // @ts-ignore
  @service declare authenticator;

  @service declare store: Store;

  get activeRepositoryLanguage() {
    return this.model.activeRepository.language?.slug;
  }

  get activeRepositoryLanguageScreencastsForList() {
    return this.screencastsForList
      .filter((screencast) => screencast.language.slug === this.activeRepositoryLanguage)
      .sort((b, a) => a.publishedAt.getTime() - b.publishedAt.getTime());
  }

  get remainingLanguageScreencastsForList() {
    return this.screencastsForList
      .filter((screencast) => screencast.language.slug !== this.activeRepositoryLanguage)
      .sort((b, a) => a.publishedAt.getTime() - b.publishedAt.getTime());
  }

  get screencasts() {
    return this.model.courseStage.screencasts;
  }

  get screencastsForList() {
    return this.screencasts.filter((screencast) => screencast !== this.selectedScreencast);
  }

  get selectedScreencast() {
    if (!this.selectedScreencastId) {
      return null;
    }

    const screencast = this.store.peekRecord('course-stage-screencast', this.selectedScreencastId) as CourseStageScreencastModel | null;

    // If screencast belongs to another stage (query params are persisted between stages), don't show it
    if (screencast && screencast.courseStage === this.model.courseStage) {
      return screencast;
    } else {
      return null;
    }
  }

  @action
  async handleDidInsertScreencastPlayer(element: HTMLDivElement) {
    this.screencastPlayerElement = element;
  }

  @action
  handleScreencastClicked(screencast: { id: string }) {
    this.selectedScreencastId = screencast.id;

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
        course_slug: this.model.courseStage.course.slug,
        course_stage_slug: this.model.courseStage.slug,
      },
    }).toggle();
  }
}
