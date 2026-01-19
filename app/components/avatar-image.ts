import Component from '@glimmer/component';
import UserModel from 'codecrafters-frontend/models/user';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLImageElement;

  Args: {
    user: UserModel;
  };
}

export default class AvatarImage extends Component<Signature> {
  @tracked avatarImageFailedToLoad = false;

  get imageUrl() {
    if (this.avatarImageFailedToLoad || !this.args.user) {
      return 'https://codecrafters.io/images/sample-avatar-3.png';
    }

    return this.args.user.avatarUrl;
  }

  @action
  handleImageLoadingError() {
    this.avatarImageFailedToLoad = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AvatarImage: typeof AvatarImage;
  }
}
