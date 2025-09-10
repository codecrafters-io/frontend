import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type UserModel from 'codecrafters-frontend/models/user';

interface UserLabelSignature {
  Element: HTMLSpanElement;

  Args: {
    user: UserModel;
    context?: CourseModel;
  };
}

type Label = {
  text: string;
  tooltipText: string;
};

export default class UserLabel extends Component<UserLabelSignature> {
  get hasCourseContext(): boolean {
    return !!this.args.context;
  }

  get isUserCurrentCourseAuthor(): boolean {
    if (!this.args.context) {
      return false;
    }

    return this.args.user.authoredCourseSlugs.includes(this.args.context.slug);
  }

  get label(): Label | null {
    if (this.args.user.isStaff) {
      return {
        text: 'staff',
        tooltipText: 'This user works at CodeCrafters',
      };
    } else if (this.hasCourseContext && this.isUserCurrentCourseAuthor) {
      return {
        text: 'challenge author',
        tooltipText: 'This user is the author of this challenge',
      };
    } else if (!this.hasCourseContext && this.args.user.hasAuthoredCourses) {
      return {
        text: 'challenge author',
        tooltipText: 'This user is the author of one or more CodeCrafters challenges',
      };
    } else {
      return null;
    }
  }
}
