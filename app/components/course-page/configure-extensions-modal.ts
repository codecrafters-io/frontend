import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onClose: () => void;
  };
};

export default class ConfigureExtensionsModalComponent extends Component<Signature> {
  @service declare store: Store;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.store.findAll('course-extension-idea', { include: 'course' });
  }

  get orderedCourseExtensionIdeas() {
    return this.args.repository.course.extensionIdeas.sortBy('reverseSortPositionForVotePage').reverse();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal': typeof ConfigureExtensionsModalComponent;
  }
}
