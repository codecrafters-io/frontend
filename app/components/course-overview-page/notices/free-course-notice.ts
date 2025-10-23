import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import TimeService from 'codecrafters-frontend/services/time';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class FreeCourseNotice extends Component<Signature> {
  @service declare time: TimeService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::Notices::FreeCourseNotice': typeof FreeCourseNotice;
  }
}
