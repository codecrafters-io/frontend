import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';

import { inject as service } from '@ember/service';

interface UserLabelSignature {
  // The arguments accepted by the component
  Args: {
    user: {
      authoredCourseSlugsList: string[];
      isStaff: boolean;
    }
    course: {
      slug: string;
    }
  };
  // Any blocks yielded by the component
  Blocks: {
    default: []
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class UserLabelComponent extends Component<UserLabelSignature> {
  @service declare router: RouterService;

  get isUserRoute() {
    return this.router.currentRouteName.includes('user');
  }

  get isCourseRoute() {
    return this.router.currentRouteName.includes('course');
  }

  get isUserCourseAuthor() {
    return this.args.user.authoredCourseSlugsList.length > 0;
  }

  get isUserCurrentCourseAuthor() {
    return this.args.user.authoredCourseSlugsList.includes(this.args.course.slug);
  }

  get text() {
    if (this.args.user.isStaff) {
      return 'staff';
    }

    if (this.isCourseRoute && this.isUserCurrentCourseAuthor) {
      return 'challenge author';
    }

    if (this.isUserRoute && this.isUserCourseAuthor) {
      return 'challenge author';
    }

    return
  }

  get tooltipText() {
    if (this.args.user.isStaff) {
      return 'This user works at CodeCrafters';
    }

    if (this.isCourseRoute && this.isUserCurrentCourseAuthor) {
      return 'This user is the author of this challenge';
    }

    if (this.isUserRoute && this.isUserCourseAuthor) {
      return 'This user is the author of one or more CodeCrafters challenges';
    }

    return
  }
}
