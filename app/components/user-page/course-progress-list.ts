import Component from '@glimmer/component';
import { groupBy } from 'codecrafters-frontend/utils/lodash-utils';
import type UserModel from 'codecrafters-frontend/models/user';
import type CourseParticipationModel from 'codecrafters-frontend/models/course-participation';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
};

export default class CourseProgressListComponent extends Component<Signature> {
  get courseParticipationGroups() {
    const participationsGroupedByCourse: CourseParticipationModel[][] = Object.values(
      groupBy(
        this.args.user.courseParticipations.filter((participation) => !participation.course.releaseStatusIsDeprecated),
        'course',
      ),
    );

    const sortedParticipationsGroupedByCourse = participationsGroupedByCourse.map((group) =>
      group.sort((a, b) => new Date(a.lastSubmissionAt).getTime() - new Date(b.lastSubmissionAt).getTime()),
    );

    sortedParticipationsGroupedByCourse.sort((groupA: CourseParticipationModel[], groupB: CourseParticipationModel[]) => {
      const groupAHasCompleted = groupA.some((participation) => participation.isCompleted);
      const groupBHasCompleted = groupB.some((participation) => participation.isCompleted);

      if (groupAHasCompleted && !groupBHasCompleted) {
        return -1;
      } else if (!groupAHasCompleted && groupBHasCompleted) {
        return 1;
      } else {
        // If both groups have completed participations or both don't, sort by the lastSubmissionAt of the last participation in the group
        const lastSubmissionA = new Date(groupA[groupA.length - 1]!.lastSubmissionAt);
        const lastSubmissionB = new Date(groupB[groupB.length - 1]!.lastSubmissionAt);

        return lastSubmissionA.getTime() - lastSubmissionB.getTime();
      }
    });

    return sortedParticipationsGroupedByCourse;
  }
}
