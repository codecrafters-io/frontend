import Component from '@glimmer/component';
import { groupBy } from 'codecrafters-frontend/lib/lodash-utils';

export default class CourseProgressListComponent extends Component {
  get courseParticipationGroups() {
    return Object.values(groupBy(this.args.user.courseParticipations, 'course'));
  }
}
