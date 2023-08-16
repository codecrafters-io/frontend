import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';

import { inject as service } from '@ember/service';

interface UserLabelSignature {
  Args: {
    user: {
      authoredCourseSlugsList: string[];
      hasAuthoredCourses: boolean;
      isStaff: boolean;
    }
  };
}

type Label = {
  text: string
  tooltipText: string
}

export default class UserLabelComponent extends Component<UserLabelSignature> {
  @service declare router: RouterService;

  get courseSlug() {
    if (!this.isCourseRoute) {
      return;
    }

    return this.router.currentURL.split('/')[2];
  }

  get isCourseRoute() {
    return this.router.currentRouteName.includes('course');
  }

  get isUserCurrentCourseAuthor() {
    return this.args.user.authoredCourseSlugsList.includes(this.courseSlug as string);
  }

  get isUserRoute() {
    return this.router.currentRouteName.includes('user');
  }

  get label(): Label | null {
    if (this.args.user.isStaff) {
      return {
        text: 'staff',
        tooltipText: 'This user works at CodeCrafters'
      }
    } else if (this.isCourseRoute && this.isUserCurrentCourseAuthor) {
      return {
        text: 'challenge author',
        tooltipText: 'This user is the author of this challenge'
      }
    } else if (!this.isCourseRoute && this.args.user.hasAuthoredCourses) {
      return {
        text: 'challenge author',
        tooltipText: 'This user is the author of one or more CodeCrafters challenges'
      }
    } else {
      return null;
    }
  }
}
