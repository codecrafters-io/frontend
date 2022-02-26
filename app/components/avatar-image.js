import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CopyableCodeComponent extends Component {
  @tracked avatarImageFailedToLoad = false;

  @action
  handleImageLoadingError() {
    this.avatarImageFailedToLoad = true;
  }

  get imageUrl() {
    if (this.avatarImageFailedToLoad) {
      return 'https://codecrafters.io/images/sample-avatar-3.png';
    } else {
      return this.args.user.avatarUrl;
    }
  }
}
