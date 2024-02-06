import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';

type Signature = {
  Args: {
    course: CourseModel;
  };
};

export default class CourseOverviewPageStageListItemComponent extends Component<Signature> {}
