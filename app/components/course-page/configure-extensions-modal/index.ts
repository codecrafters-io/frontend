import Component from '@glimmer/component';
import CourseExtensionActivationModel from 'codecrafters-frontend/models/course-extension-activation';
import CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onClose: () => void;
  };
}

export default class ConfigureExtensionsModal extends Component<Signature> {
  @service declare store: Store;
  @tracked allCourseExtensionIdeas: CourseExtensionIdeaModel[] = [];

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.loadAllCourseExtensionIdeas();
  }

  get allExtensionsSorted() {
    const extensions = this.args.repository.course.sortedExtensions;
    const disabled = extensions.filter((ext) => !this.enabledExtensions.includes(ext)).sortBy('position');

    return [...this.enabledExtensions, ...disabled];
  }

  get enabledExtensions() {
    return this.args.repository.extensionActivations.sortBy('position').map((activation) => activation.extension);
  }

  get orderedCourseExtensionIdeas() {
    return this.allCourseExtensionIdeas
      .filterBy('course', this.args.repository.course)
      .rejectBy('developmentStatus', 'released')
      .sortBy('sortPositionForRoadmapPage');
  }

  @action
  async handleSortableItemsReordered(sortedItems: CourseExtensionModel[]) {
    const positions = sortedItems
      .filter((extension) => this.isExtensionEnabled(extension))
      .map((extension, index) => {
        const activation = this.args.repository.extensionActivations.find((act) => act.extension.id === extension.id);
        if (!activation) return null;

        return {
          activation,
          id: activation.id,
          position: index + 1, // 1-based counting
        };
      })
      .filter(Boolean) as Array<{ activation: CourseExtensionActivationModel; id: string; position: number }>;

    // This is to pre-update so the drag isn't jarring
    positions.forEach(({ activation, position }) => {
      activation.position = position;
    });

    await (this.store.createRecord('course-extension-activation') as CourseExtensionActivationModel).reorder({
      repository_id: this.args.repository.id,
      positions: positions.map(({ id, position }) => ({ id, position })),
    });
  }

  @action
  isExtensionEnabled(extension: CourseExtensionModel): boolean {
    return this.args.repository.extensionActivations.some((activation) => activation.extension.id === extension.id);
  }

  @action
  async loadAllCourseExtensionIdeas() {
    this.allCourseExtensionIdeas = (await this.store.findAll('course-extension-idea', {
      include: 'course,current-user-votes,current-user-votes.user',
    })) as unknown as CourseExtensionIdeaModel[];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal': typeof ConfigureExtensionsModal;
  }
}
