import Component from '@glimmer/component';
import type CourseStageScreencastModel from 'codecrafters-frontend/models/course-stage-screencast';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    screencast: CourseStageScreencastModel;
  };
}

export default class CourseStageScreencastPlayer extends Component<Signature> {}
