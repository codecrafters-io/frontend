import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';

type Signature = {
  Args: {
    user: TemporaryUserModel;
  };

  Element: HTMLImageElement;
};

export default class AvatarImageComponent extends Component<Signature> {
  @tracked avatarImageFailedToLoad = false;

  get imageUrl() {
    if (this.avatarImageFailedToLoad) {
      return 'https://codecrafters.io/images/sample-avatar-3.png';
    } else {
      return this.args.user.avatarUrl;
    }
  }

  @action
  handleImageLoadingError() {
    this.avatarImageFailedToLoad = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AvatarImage: typeof AvatarImageComponent;
  }
}
