import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';

import { inject as service } from '@ember/service';

interface UserLabelSignature {
  Element: HTMLDivElement;

  Args: {
    user: {
      authoredCourseSlugsList: string[];
      hasAuthoredCourses: boolean;
      isStaff: boolean;
    }
    target: {
      course?: {
        slug: string;
      }
      courseStage?: {
        course: {
          slug: string;
        }
      }
    }
  };
}

type Label = {
  text: string
  tooltipText: string
}

export default class UserLabelComponent extends Component<UserLabelSignature> {
  @service declare router: RouterService;

  get courseSlug(): string | undefined {
    return this.args.target.course?.slug || this.args.target.courseStage?.course.slug;
  }

  get hasCourseContext(): boolean {
    return !!this.args.target;
  }

  get isUserCurrentCourseAuthor(): boolean {
    if (!this.courseSlug) {
      return false
    }

    return this.args.user.authoredCourseSlugsList.includes(this.courseSlug);
  }

  get label(): Label | null {
    if (this.args.user.isStaff) {
      return {
        text: 'staff',
        tooltipText: 'This user works at CodeCrafters'
      }
    } else if (this.hasCourseContext && this.isUserCurrentCourseAuthor) {
      return {
        text: 'challenge author',
        tooltipText: 'This user is the author of this challenge'
      }
    } else if (!this.hasCourseContext && this.args.user.hasAuthoredCourses) {
      return {
        text: 'challenge author',
        tooltipText: 'This user is the author of one or more CodeCrafters challenges'
      }
    } else {
      return null;
    }
  }
}
