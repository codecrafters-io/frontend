import Component from '@glimmer/component';
import { groupBy } from 'codecrafters-frontend/utils/lodash-utils';

export default class ActivityContainer extends Component {
  get profileEventGroups() {
    return groupBy(this.args.user.profileEvents.sortBy('occurredAt').reverse(), (profileEvent) => this.formatDate(profileEvent.occurredAt));
  }

  formatDate(date) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}
