import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    course: {
      slug: string;
    };
    activeStep: Step;
    nextStep: Step | null;
    currentStep: Step;
    stepList: StepList;
    onMobileSidebarButtonClick: () => void;
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

  // @ts-ignore
  @service featureFlags;

  @service declare router: RouterService;

  get allTabs(): Tab[] {
    return {
      SetupStep: this.setupTabs,
      CourseCompletedStep: this.courseCompletedTabs,
      CourseStageStep: this.stageTabs,
      IntroductionStep: this.introductionTabs,
    }[this.args.currentStep.type];
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

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get introductionTabs() {
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

  get stageTabs() {
    const tabs: Tab[] = [];

    tabs.push({
      icon: 'document-text',
      name: 'Instructions',
      slug: 'instructions',
      route: 'course.stage.instructions',
      models: this.args.currentStep.routeParams.models,
      isActive: this.router.currentRouteName === 'course.stage.instructions',
    });

    tabs.push({
      icon: 'code',
      name: 'Code Examples',
      slug: 'code_examples',
      route: 'course.stage.code-examples',
      models: this.args.currentStep.routeParams.models,
      isActive: this.router.currentRouteName === 'course.stage.code-examples',
    });

    // @ts-ignore
    if (this.args.currentStep.courseStage && this.args.currentStep.courseStage.hasScreencasts) {
      tabs.push({
        icon: 'play',
        name: 'Screencasts',
        slug: 'screencasts',
        route: 'course.stage.screencasts',
        models: this.args.currentStep.routeParams.models,
        isActive: this.router.currentRouteName === 'course.stage.screencasts',
      });
    }

    return tabs;
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
}
