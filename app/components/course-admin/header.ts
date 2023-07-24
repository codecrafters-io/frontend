import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    course: { slug: string };
  };
};

type Tab = {
  icon: string;
  name: string;
  slug: string;
  route: string;
  models: unknown[];
  isActive: boolean;
};

export default class CourseAdminHeaderComponent extends Component<Signature> {
  @service declare router: RouterService;

  get tabs(): Tab[] {
    return [
      {
        icon: 'code',
        name: 'Submissions',
        slug: 'submissions',
        route: 'course-admin.submissions',
        models: [this.args.course.slug],
        isActive: this.router.currentRouteName === 'course-admin.submissions',
      },
      {
        icon: 'github',
        name: 'Updates',
        slug: 'updates',
        route: 'course-admin.updates',
        models: [this.args.course.slug],
        isActive: this.router.currentRouteName === 'course-admin.updates' || this.router.currentRouteName === 'course-admin.update',
      },
    ];
  }
}
