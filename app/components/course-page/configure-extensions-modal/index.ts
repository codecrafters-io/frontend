import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onClose: () => void;
  };
}

export default class ConfigureExtensionsModal extends Component<Signature> {
  @service declare store: Store;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);
    this.loadAllCourseExtensionIdeas();
  }

  get orderedCourseExtensionIdeas() {
    return this.args.repository.course.votableExtensionIdeas.sort(fieldComparator('sortPositionForRoadmapPage'));
  }

  @action
  async loadAllCourseExtensionIdeas() {
    await this.store.findAll('course-extension-idea', {
      include: 'course,current-user-votes,current-user-votes.user',
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal': typeof ConfigureExtensionsModal;
  }
}
