import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    course: CourseModel;
    language: LanguageModel;
  };
}

export default class VisitCourseOverviewButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::VisitCourseOverviewButton': typeof VisitCourseOverviewButton;
  }
}
