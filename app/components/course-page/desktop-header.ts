import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import RouterService from '@ember/routing/router-service';

type Signature = {
  Args: {
    currentStep: Step;
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

export default class DesktopHeaderComponent extends Component<Signature> {
  // @ts-ignore
  @service authenticator;

  @service declare router: RouterService;

  get allTabs(): Tab[] {
    return { SetupStep: this.setupTabs, CourseCompletedStep: this.courseCompletedTabs, CourseStageStep: this.stageTabs }[this.args.currentStep.type];
  }

  get courseCompletedTabs() {
    return [
      {
        icon: 'sparkles',
        name: 'Congratulations!',
        slug: 'congratulations',
        route: this.args.currentStep.routeParams.route,
        models: this.args.currentStep.routeParams.models,
        isActive: this.router.currentRouteName === this.args.currentStep.routeParams.route,
      },
    ];
  }

  get stageTabs() {
    return [
      {
        icon: 'document-text',
        name: 'Instructions',
        slug: 'instructions',
        route: 'course.stage.instructions',
        models: this.args.currentStep.routeParams.models,
        isActive: this.router.currentRouteName === 'course.stage.instructions',
      },
      {
        icon: 'code',
        name: 'Code Examples',
        slug: 'code_examples',
        route: 'course.stage.code-examples',
        models: this.args.currentStep.routeParams.models,
        isActive: this.router.currentRouteName === 'course.stage.code-examples',
      },
    ];
  }

  get setupTabs() {
    return [
      {
        icon: 'document-text',
        name: 'Instructions',
        slug: 'instructions',
        route: this.args.currentStep.routeParams.route,
        models: this.args.currentStep.routeParams.models,
        isActive: this.router.currentRouteName === this.args.currentStep.routeParams.route,
      },
    ];
  }

  get availableTabs() {
    return this.allTabs.filter((tab) => this.tabIsAvailable(tab));
  }

  tabIsAvailable(tab: Tab) {
    if (this.args.currentStep.type === 'SetupStep') {
      return tab.slug === 'instructions';
    }

    if (this.args.currentStep.type === 'CourseStageStep') {
      if (tab.slug === 'instructions') {
        return true;
      }

      if (tab.slug === 'code_examples') {
        // @ts-ignore
        return !this.args.currentStep.courseStage.isFirst;
      }
    }

    return true;

    // if (tab === 'verified_solution') {
    //   return false;
    // } else if (tab === 'screencasts') {
    //   return this.featureFlags.canSeeScreencasts && this.courseStage.hasScreencasts;
    // } else {
    //   return true;
    // }
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}
