import Component from '@glimmer/component';
import { service } from '@ember/service';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import type SubmissionModel from 'codecrafters-frontend/models/submission';
import { codeCraftersDark, codeCraftersLight } from 'codecrafters-frontend/utils/code-mirror-themes';
interface Signature {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel;
  };
}

export default class DiffContainerComponent extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  get codeMirrorTheme() {
    return this.darkMode.isEnabled ? codeCraftersDark : codeCraftersLight;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetails::DiffContainer': typeof DiffContainerComponent;
  }
}
