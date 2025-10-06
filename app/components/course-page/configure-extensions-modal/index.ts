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
    const extensionActivations = this.args.repository.extensionActivations.sortBy('position');
    const activatedIds = extensionActivations.map((activation) => activation.extension.id);

    const enabled = activatedIds.map((id) => extensions.find((ext) => ext.id === id)).filter(Boolean) as CourseExtensionModel[];
    const disabled = extensions.filter((ext) => !activatedIds.includes(ext.id)).sortBy('position');

    return [...enabled, ...disabled];
  }

  get enabledExtensionIds() {
    return this.args.repository.extensionActivations.map((activation) => activation.extension.id);
  }

  get orderedCourseExtensionIdeas() {
    return this.allCourseExtensionIdeas
      .filterBy('course', this.args.repository.course)
      .rejectBy('developmentStatus', 'released')
      .sortBy('sortPositionForRoadmapPage');
  }

  @action
  async handleSortableItemsReordered(sortedItems: CourseExtensionModel[]) {
    // Map sorted extensions to their activation IDs with new positions (1-based)
    const positions = sortedItems
      .map((extension, index) => {
        const activation = this.args.repository.extensionActivations.find((act) => act.extension.id === extension.id);
        if (!activation) return null;

        return {
          activation,
          id: activation.id,
          position: index + 1, // 1-based position
        };
      })
      .filter(Boolean) as Array<{ activation: CourseExtensionActivationModel; id: string; position: number }>;

    // Optimistically update positions locally first so the drag doesn't feel jarring
    positions.forEach(({ activation, position }) => {
      activation.position = position;
    });

    try {
      await (this.store.createRecord('course-extension-activation') as CourseExtensionActivationModel).reorder({
        repository_id: this.args.repository.id,
        positions: positions.map(({ id, position }) => ({ id, position })),
      });
    } catch (error) {
      console.error('Error reordering extensions:', error);
      // TODO: Show error message to user and revert positions
    }
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
