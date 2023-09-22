import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { inject as service } from '@ember/service';
import { TemporaryCourseModel } from 'codecrafters-frontend/models/temporary-types';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    course: TemporaryCourseModel;
    currentStep: Step;
    nextStep: Step | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepList;
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
      BaseStagesCompletedStep: this.courseCompletedTabs, // Can be the same as CourseCompletedStep for now
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

    // @ts-ignore
    if (this.args.currentStep.courseStage && this.args.currentStep.courseStage.course.hasConcepts) {
      tabs.push({
        icon: 'academic-cap',
        name: 'Concepts',
        slug: 'concepts',
        route: 'course.stage.concepts',
        models: this.args.currentStep.routeParams.models,
        isActive: this.router.currentRouteName === 'course.stage.concepts',
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
      // @ts-ignore
      if (this.args.currentStep.courseStage.isFirst) {
        return tab.slug === 'instructions';
      } else {
        return true;
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
