import Component from '@glimmer/component';
import type SubmissionModel from 'codecrafters-frontend/models/submission';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import groupByFieldReducer from 'codecrafters-frontend/utils/group-by-field-reducer';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submissions: SubmissionModel[];
    selectedSubmission: SubmissionModel | null;
    onSubmissionSelect: (submission: SubmissionModel) => void;
  };
}

export default class AdminCourseSubmissionsPageTimelineContainer extends Component<Signature> {
  get groupedSubmissions(): Record<string, SubmissionModel[]> {
    return this.args.submissions
      .toSorted(fieldComparator('createdAt'))
      .reverse()
      .reduce(
        groupByFieldReducer(({ createdAt }) => createdAt.toISOString().slice(0, 10)),
        {},
      );
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::TimelineContainer': typeof AdminCourseSubmissionsPageTimelineContainer;
  }
}
