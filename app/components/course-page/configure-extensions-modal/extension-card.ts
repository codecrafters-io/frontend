import Component from '@glimmer/component';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';

// @ts-ignore
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    extension: CourseExtensionModel;
  };
};

export default class ExtensionCardComponent extends Component<Signature> {
  @service store!: Store;
  @service coursePageState!: CoursePageStateService;

  @tracked unsavedIsActivatedValue: boolean | null = null;

  get activations() {
    return this.args.repository.extensionActivations.filter((activation) => activation.extension === this.args.extension);
  }

  get isActivated(): boolean {
    return this.activations.length > 0;
  }

  get optimisticValueForIsActivated(): boolean {
    if (this.unsavedIsActivatedValue !== null) {
      return this.unsavedIsActivatedValue;
    } else {
      return this.isActivated;
    }
  }

  syncActivation = task({ keepLatest: true }, async (): Promise<void> => {
    if (this.unsavedIsActivatedValue === null) {
      return;
    }

    // Store values at the start of the task
    const shouldCreate = this.unsavedIsActivatedValue === true;
    const shouldDestroy = !shouldCreate;

    if (shouldDestroy) {
      for (const activation of this.activations) {
        await activation.destroyRecord();
      }
    } else {
      await this.store
        .createRecord('course-extension-activation', {
          repository: this.args.repository,
          extension: this.args.extension,
        })
        .save();
    }

    await this.store.query('repository', {
      course_id: this.args.repository.course.id,
      include: RepositoryPoller.defaultIncludedResources,
    });

    // For some reason, running this in the current run-loop causes problems?
    next(() => {
      const newStageListItemIds = this.args.repository.stageList!.items.map((x) => x.id);
      const itemsToRemove: RepositoryStageListItemModel[] = [];

      this.store.peekAll('repository-stage-list-item').forEach((item) => {
        if (item.list !== this.args.repository.stageList) {
          return;
        }

        if (newStageListItemIds.includes(item.id)) {
          return;
        }

        itemsToRemove.push(item);
      });

      itemsToRemove.forEach((item) => {
        item.unloadRecord();
      });
    });

    // If we performed the same action as whatever the user's latest request was, then we can reset the request.
    if (shouldCreate && this.unsavedIsActivatedValue === true && this.isActivated) {
      this.unsavedIsActivatedValue = null;
    }

    // If we performed the same action as whatever the user's latest request was, then we can reset the request.
    if (shouldDestroy && this.unsavedIsActivatedValue === false && !this.isActivated) {
      this.unsavedIsActivatedValue = null;
    }

    // The stage a user is currently on might not be present in the list anymore
    this.coursePageState.navigateToActiveStepIfCurrentStepIsInvalid();
  });

  @action
  async handleClick(): Promise<void> {
    if (this.unsavedIsActivatedValue === null) {
      this.unsavedIsActivatedValue = !this.isActivated;
    } else {
      this.unsavedIsActivatedValue = !this.unsavedIsActivatedValue;
    }

    this.syncActivation.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal::ExtensionCard': typeof ExtensionCardComponent;
  }
}
