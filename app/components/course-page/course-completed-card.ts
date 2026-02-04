import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class CourseCompletedCard extends Component<Signature> {
  @service declare store: Store;

  congratulationsImage = congratulationsImage;

  @tracked configureGithubIntegrationModalIsOpen = false;

  loadExtensionIdeasTask = task({ drop: true }, async (): Promise<void> => {
    await this.store.query('course-extension-idea', {
      course_id: this.args.repository.course.id,
      include: 'course,current-user-votes,current-user-votes.user',
    });
  });

  @action
  handleDidInsert() {
    this.loadExtensionIdeasTask.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseCompletedCard': typeof CourseCompletedCard;
  }
}
