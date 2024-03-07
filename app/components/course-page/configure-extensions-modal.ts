import Component from '@glimmer/component';
import CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import RepositoryModel from 'codecrafters-frontend/models/repository';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    courseExtensionIdeas: CourseExtensionIdeaModel[];
    repository: RepositoryModel;
    onClose: () => void;
  };
};

export default class ConfigureExtensionsModalComponent extends Component<Signature> {
  get orderedCourseExtensionIdeas() {
    return this.args.courseExtensionIdeas.sortBy('reverseSortPositionForVotePage').reverse();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal': typeof ConfigureExtensionsModalComponent;
  }
}
