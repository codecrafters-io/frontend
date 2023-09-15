import Component from '@glimmer/component';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import Store from '@ember-data/store';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';
import { action } from '@ember/object';
import { service } from '@ember/service';
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

  @tracked isSaving = false;

  get isActivated(): boolean {
    return this.activations.length > 0;
  }

  get activations() {
    return this.args.repository.courseExtensionActivations.filter((activation) => activation.extension === this.args.extension);
  }

  @action
  async handleClick(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    if (this.isActivated) {
      for (const activation of this.activations) {
        try {
          await activation.destroyRecord();
        } catch (e) {
          // @ts-ignore
          if (e.errors[0].status === '404') {
            // This is fine, it means the activation was already deleted.
          }
        }
      }

      if (this.args.repository.stageList) {
        this.args.repository.stageList.items.toArray().forEach((item) => {
          if (item.stage.primaryExtensionSlug === this.args.extension.slug) {
            item.unloadRecord();
          }
        });

        await this.store.query('repository', {
          course_id: this.args.repository.course.id,
          include: RepositoryPoller.defaultIncludedResources,
        });
      }
    } else {
      await this.store
        .createRecord('course-extension-activation', {
          repository: this.args.repository,
          extension: this.args.extension,
        })
        .save();

      await this.store.query('repository', {
        course_id: this.args.repository.course.id,
        include: RepositoryPoller.defaultIncludedResources,
      });
    }

    this.isSaving = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal::ExtensionCard': typeof ExtensionCardComponent;
  }
}
