import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

type Tab = {
  icon: string;
  name: string;
  slug: string;
  route: string;
  models: string[];
  isActive: boolean;
};

export default class CourseAdminHeader extends Component<Signature> {
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
        isActive: ['course-admin.updates', 'course-admin.update'].includes(this.router.currentRouteName),
      },
      {
        icon: 'clipboard-check',
        name: 'Tester Versions',
        slug: 'tester-versions',
        route: 'course-admin.tester-versions',
        models: [this.args.course.slug],
        isActive: ['course-admin.tester-versions', 'course-admin.tester-version'].includes(this.router.currentRouteName),
      },
      {
        icon: 'speakerphone',
        name: 'Feedback',
        slug: 'feedback',
        route: 'course-admin.feedback',
        models: [this.args.course.slug],
        isActive: this.router.currentRouteName === 'course-admin.feedback',
      },
      {
        icon: 'terminal',
        name: 'Buildpacks',
        slug: 'buildpacks',
        route: 'course-admin.buildpacks',
        models: [this.args.course.slug],
        isActive: ['course-admin.buildpacks', 'course-admin.buildpack'].includes(this.router.currentRouteName),
      },
      {
        icon: 'chart-bar',
        name: 'Insights',
        slug: 'insights',
        route: 'course-admin.insights',
        models: [this.args.course.slug],
        isActive: this.router.currentRouteName === 'course-admin.insights',
      },
      {
        icon: 'presentation-chart-bar',
        name: 'Stage Insights',
        slug: 'stage-insights',
        route: 'course-admin.stage-insights-index',
        models: [this.args.course.slug],
        isActive: ['course-admin.stage-insights-index', 'course-admin.stage-insights'].includes(this.router.currentRouteName),
      },
      {
        icon: 'document-text',
        name: 'Code Examples',
        slug: 'code-examples',
        route: 'course-admin.code-example-insights-index',
        models: [this.args.course.slug],
        isActive: ['course-admin.code-example-insights-index', 'course-admin.code-example-insights'].includes(this.router.currentRouteName),
      },
      {
        icon: 'academic-cap',
        name: 'Evaluators',
        slug: 'evaluators',
        route: 'course-admin.code-example-evaluators',
        models: [this.args.course.slug],
        isActive: ['course-admin.code-example-evaluators', 'course-admin.code-example-evaluator'].includes(this.router.currentRouteName),
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::Header': typeof CourseAdminHeader;
  }
}
