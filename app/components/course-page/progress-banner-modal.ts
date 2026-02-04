import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    repository: RepositoryModel;
  };
}

export default class CoursePageProgressBannerModal extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ProgressBannerModal': typeof CoursePageProgressBannerModal;
  }
}
