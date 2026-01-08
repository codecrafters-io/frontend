import Component from '@glimmer/component';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import groupByFieldReducer from 'codecrafters-frontend/utils/group-by-field-reducer';

export default class ActivityContainer extends Component {
  get profileEventGroups() {
    return this.args.user.profileEvents
      .toSorted(fieldComparator('occurredAt'))
      .reverse()
      .reduce(
        groupByFieldReducer((profileEvent) => this.formatDate(profileEvent.occurredAt)),
        {},
      );
  }

  formatDate(date) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}
