import Component from '@glimmer/component';
import { groupBy } from 'codecrafters-frontend/lib/lodash-utils';

export default class ActivityContainerComponent extends Component {
  formatDate(date) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  get profileEventGroups() {
    return groupBy(this.args.user.profileEvents.sortBy('occurredAt').reverse(), (profileEvent) => this.formatDate(profileEvent.occurredAt));
  }
}
