import Component from '@glimmer/component';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: TemporaryRepositoryModel;
    onClose: () => void;
  };
};

export default class ConfigureExtensionsModalComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal': typeof ConfigureExtensionsModalComponent;
  }
}
