import Component from '@glimmer/component';
import { groupBy } from 'codecrafters-frontend/utils/lodash-utils';

export default class CourseProgressListComponent extends Component {
  get CourseParticipationGroups() {
    const sortedParticipationsGroupedByCourse = Object.values(groupBy(this.args.user.courseParticipations, 'course')).map((group) =>
      group.sort((a, b) => new Date(a.lastSubmissionAt) - new Date(b.lastSubmissionAt)),
    );

    sortedParticipationsGroupedByCourse.sort((groupA, groupB) => {
      const groupAHasCompleted = groupA.some((participation) => participation.isCompleted);
      const groupBHasCompleted = groupB.some((participation) => participation.isCompleted);

      if (groupAHasCompleted && !groupBHasCompleted) {
        return -1; // Group A comes before Group B
      } else if (!groupAHasCompleted && groupBHasCompleted) {
        return 1; // Group B comes before Group A
      } else {
        // If both groups have completed participations or both don't, sort by the lastSubmissionAt of the last participation in the group
        const lastSubmissionA = new Date(groupA[groupA.length - 1].lastSubmissionAt);
        const lastSubmissionB = new Date(groupB[groupB.length - 1].lastSubmissionAt);

        return lastSubmissionA - lastSubmissionB;
      }
    });

    return sortedParticipationsGroupedByCourse;
  }
}
