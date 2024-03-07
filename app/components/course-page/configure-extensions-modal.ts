import Component from '@glimmer/component';
import CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onClose: () => void;
  };
};

export default class ConfigureExtensionsModalComponent extends Component<Signature> {
  @service declare store: Store;
  @tracked allCourseExtensionIdeas: CourseExtensionIdeaModel[] = [];

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.loadAllCourseExtensionIdeas();
  }

  get orderedCourseExtensionIdeas() {
    return this.allCourseExtensionIdeas.filterBy('course', this.args.repository.course).sortBy('reverseSortPositionForVotePage').reverse();
  }

  @action
  async loadAllCourseExtensionIdeas() {
    this.allCourseExtensionIdeas = await this.store.findAll('course-extension-idea', {
      include: 'course,current-user-votes,current-user-votes.user',
    }) as unknown as CourseExtensionIdeaModel[];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal': typeof ConfigureExtensionsModalComponent;
  }
}
