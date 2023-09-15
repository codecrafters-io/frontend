import Component from '@glimmer/component';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import Store from '@ember-data/store';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

// @ts-ignore
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: TemporaryRepositoryModel;
    extension: CourseExtensionModel;
  };
};

export default class ExtensionCardComponent extends Component<Signature> {
  @service store!: Store;
  @tracked unsavedIsActivatedValue: boolean | null = null;

  get optimisticIsActivated(): boolean {
    if (this.unsavedIsActivatedValue !== null) {
      return this.unsavedIsActivatedValue;
    } else {
      return this.isActivated;
    }
  }

  get isActivated(): boolean {
    return this.activations.length > 0;
  }

  get activations() {
    return this.args.repository.courseExtensionActivations.filter((activation) => activation.extension === this.args.extension);
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

      if (this.args.repository.stageList) {
        this.args.repository.stageList.items.toArray().forEach((item) => {
          if (item.stage.primaryExtensionSlug === this.args.extension.slug) {
            item.unloadRecord();
          }
        });
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

    // If we performed the same action as whatever the user's latest request was, then we can reset the request.
    if (shouldCreate && this.unsavedIsActivatedValue === true && this.isActivated) {
      this.unsavedIsActivatedValue = null;
    }

    // If we performed the same action as whatever the user's latest request was, then we can reset the request.
    if (shouldDestroy && this.unsavedIsActivatedValue === false && !this.isActivated) {
      this.unsavedIsActivatedValue = null;
    }
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
