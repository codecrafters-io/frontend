import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Args: {
    course: CourseModel;
  };
}

export default class VisitCourseOverviewButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::VisitCourseOverviewButton': typeof VisitCourseOverviewButton;
  }
}
