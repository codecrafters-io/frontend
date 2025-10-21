import Component from '@glimmer/component';
import CourseExtensionActivationModel from 'codecrafters-frontend/models/course-extension-activation';
import CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { easeOut } from 'ember-animated/easings/cosine';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onClose: () => void;
  };
}

export default class ConfigureExtensionsModal extends Component<Signature> {
  @service declare store: Store;
  @service declare coursePageState: CoursePageStateService;
  @tracked allCourseExtensionIdeas: CourseExtensionIdeaModel[] = [];
  @tracked disablingExtensionIds: Record<string, boolean> = {};

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.loadAllCourseExtensionIdeas();
  }

  get disabledExtensions() {
    const activatedIds = this.args.repository.extensionActivations.map((activation) => activation.extension.id);

    return this.args.repository.course.sortedExtensions.filter((ext) => !activatedIds.includes(ext.id) || this.disablingExtensionIds[ext.id]);
  }

  get enabledExtensions() {
    return this.args.repository.extensionActivations
      .slice()
      .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
      .map((activation) => activation.extension)
      .filter((ext) => !this.disablingExtensionIds[ext.id]);
  }

  get orderedCourseExtensionIdeas() {
    return this.allCourseExtensionIdeas
      .filterBy('course', this.args.repository.course)
      .rejectBy('developmentStatus', 'released')
      .sortBy('sortPositionForRoadmapPage');
  }

  // @ts-expect-error ember-animated not typed
  // eslint-disable-next-line require-yield
  *extensionTransition({ insertedSprites, removedSprites }) {
    for (const sprite of insertedSprites) {
      sprite.startTranslatedBy(0, -20);
      move(sprite, { easing: easeOut });
      fadeIn(sprite, { easing: easeOut });
    }

    for (const sprite of removedSprites) {
      sprite.endTranslatedBy(0, -20);
      move(sprite, { easing: easeOut });
      fadeOut(sprite, { easing: easeOut });
    }
  }

  @action
  async handleExtensionToggle(extension: CourseExtensionModel): Promise<void> {
    const activations = this.args.repository.extensionActivations.filter((activation) => activation.extension === extension);
    const isDisabling = activations.length > 0;

    if (isDisabling) {
      this.disablingExtensionIds = { ...this.disablingExtensionIds, [extension.id]: true };
    }

    try {
      if (isDisabling) {
        for (const activation of activations) {
          await activation.destroyRecord();
        }
      } else {
        await this.store
          .createRecord('course-extension-activation', {
            repository: this.args.repository,
            extension,
          })
          .save();
      }

      await this.syncExtensionActivations();
    } finally {
      if (isDisabling) {
        const newState = { ...this.disablingExtensionIds };
        delete newState[extension.id];
        this.disablingExtensionIds = newState;
      }
    }
  }

  @action
  async handleSortableItemsReordered(sortedItems: CourseExtensionModel[]) {
    const updates = sortedItems
      .map((extension, index) => {
        const activation = this.args.repository.extensionActivations.find((act) => act.extension.id === extension.id);
        if (!activation) return null;

        return {
          activation,
          id: activation.id,
          originalPosition: activation.position,
          newPosition: index + 1, // 1-based position
        };
      })
      .filter(Boolean) as Array<{
      activation: CourseExtensionActivationModel;
      id: string;
      originalPosition: number;
      newPosition: number;
    }>;

    // Optimistically update positions
    updates.forEach(({ activation, newPosition }) => {
      activation.position = newPosition;
    });

    const tempRecord = this.store.createRecord('course-extension-activation') as CourseExtensionActivationModel;

    try {
      await tempRecord.reorder({
        repository_id: this.args.repository.id,
        positions: updates.map(({ id, newPosition }) => ({ id, position: newPosition })),
      });

      await this.syncExtensionActivations();
    } catch (error) {
      console.error('Error reordering extensions:', error);

      // Rollback on error
      updates.forEach(({ activation, originalPosition }) => {
        activation.position = originalPosition;
      });

      // TODO: Show error message to user
    } finally {
      tempRecord.unloadRecord();
    }
  }

  @action
  isExtensionDisabling(extensionId: string): boolean {
    return !!this.disablingExtensionIds[extensionId];
  }

  @action
  async loadAllCourseExtensionIdeas() {
    this.allCourseExtensionIdeas = (await this.store.findAll('course-extension-idea', {
      include: 'course,current-user-votes,current-user-votes.user',
    })) as unknown as CourseExtensionIdeaModel[];
  }

  @action
  async syncExtensionActivations(): Promise<void> {
    await this.store.query('repository', {
      course_id: this.args.repository.course.id,
      include: 'stage-list,stage-list.items,stage-list.items.stage,extension-activations,extension-activations.extension',
    });

    // Rebuild the step list to reflect the updated extensions
    this.coursePageState.setStepList(new StepListDefinition(this.args.repository));

    // The stage a user is currently on might not be present in the list anymore
    this.coursePageState.navigateToActiveStepIfCurrentStepIsInvalid();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal': typeof ConfigureExtensionsModal;
  }
}
