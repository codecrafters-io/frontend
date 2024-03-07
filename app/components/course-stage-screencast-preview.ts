import Component from '@glimmer/component';
import type CourseStageScreencastModel from 'codecrafters-frontend/models/course-stage-screencast';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    screencast: CourseStageScreencastModel;
  };
}

export default class CourseStageScreencastPlayer extends Component<Signature> {
  get durationInSecondsRoundedToNearestMinute() {
    const { durationInSeconds } = this.args.screencast;

    if (durationInSeconds < 60) {
      return durationInSeconds;
    } else {
      return Math.round(durationInSeconds / 60) * 60;
    }
  }
}
