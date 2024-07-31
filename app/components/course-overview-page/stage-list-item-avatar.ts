import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    user: UserModel;
  };
}

export default class StageListItemAvatarComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StageListItemAvatar': typeof StageListItemAvatarComponent;
  }
}
