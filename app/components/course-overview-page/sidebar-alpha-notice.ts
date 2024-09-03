import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class SidebarAlphaNoticeComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::SidebarAlphaNotice': typeof SidebarAlphaNoticeComponent;
  }
}
