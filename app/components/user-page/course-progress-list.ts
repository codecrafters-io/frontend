import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';
import groupByFieldReducer from 'codecrafters-frontend/utils/group-by-field-reducer';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import { compare } from '@ember/utils';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
}

export default class CourseProgressList extends Component<Signature> {
  get courseParticipationGroups() {
    return Object.values(
      this.args.user.courseParticipations
        .filter(({ course }) => !course.visibilityIsPrivate && !course.releaseStatusIsAlpha)
        .reduce(
          groupByFieldReducer(({ course: { id } }) => id),
          {},
        ),
    )
      .map((group) => group.toSorted(fieldComparator('lastSubmissionAt')))
      .sort((groupA, groupB) => {
        const groupAHasCompleted = groupA.some(({ isCompleted }) => isCompleted);
        const groupBHasCompleted = groupB.some(({ isCompleted }) => isCompleted);

        if (groupAHasCompleted && !groupBHasCompleted) {
          return -1;
        }

        if (!groupAHasCompleted && groupBHasCompleted) {
          return 1;
        }

        // If both groups have completed participations or both don't, sort
        // by the `lastSubmissionAt` of the last participation in the group
        return compare(groupA.at(-1)?.lastSubmissionAt, groupB.at(-1)?.lastSubmissionAt);
      });
  }
}
