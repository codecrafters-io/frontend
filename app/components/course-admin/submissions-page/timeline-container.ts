import Component from '@glimmer/component';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submissions: SubmissionModel[];
    selectedSubmission: SubmissionModel | null;
    onSubmissionSelect: (submission: SubmissionModel) => void;
  };
}

function groupBy<T>(collection: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  collection.forEach((element) => {
    const groupKey = keyFn(element);

    if (Object.hasOwnProperty.call(result, groupKey)) {
      result[groupKey]!.push(element);
    } else {
      result[groupKey] = [element];
    }
  });

  return result;
}

export default class AdminCourseSubmissionsPageTimelineContainerComponent extends Component<Signature> {
  get groupedSubmissions(): Record<string, SubmissionModel[]> {
    return groupBy(this.args.submissions.toArray().sortBy('createdAt').reverse(), (submission) => {
      return submission.createdAt.toISOString().slice(0, 10);
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::TimelineContainer': typeof AdminCourseSubmissionsPageTimelineContainerComponent;
  }
}
