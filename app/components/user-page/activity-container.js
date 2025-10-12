import Component from '@glimmer/component';
import { groupBy } from 'codecrafters-frontend/utils/lodash-utils';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class ActivityContainer extends Component {
  get profileEventGroups() {
    return groupBy(this.args.user.profileEvents.toSorted(fieldComparator('occurredAt')).reverse(), (profileEvent) =>
      this.formatDate(profileEvent.occurredAt),
    );
  }

  formatDate(date) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}
