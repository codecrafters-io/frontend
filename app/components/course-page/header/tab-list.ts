import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import RouterService from '@ember/routing/router-service';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/utils/course-page-step-list';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    course: CourseModel;
    currentStep: Step;
    nextStep: Step | null;
    stepList: StepList;
  };
};

type Tab = {
  icon: string;
  name: string;
  slug: string;
  externalLink?: { url: string };
  internalLink?: { route: string; models: string[] }; // Easier to type this using two params than one union type
  isActive: boolean;
};

export default class TabListComponent extends Component<Signature> {
  @service declare router: RouterService;

  get allTabs(): Tab[] {
    return {
      SetupStep: this.setupTabs,
      CourseCompletedStep: this.courseCompletedTabs,
      CourseStageStep: this.stageTabs,
      IntroductionStep: this.introductionTabs,
      BaseStagesCompletedStep: this.courseCompletedTabs, // Can be the same as CourseCompletedStep for now
      ExtensionCompletedStep: this.courseCompletedTabs, // Can be the same as CourseCompletedStep for now
    }[this.args.currentStep.type];
  }

  get availableTabs() {
    return this.allTabs.filter((tab) => this.tabIsAvailable(tab));
  }

  get courseCompletedTabs(): Tab[] {
    return [
      {
        icon: 'sparkles',
        name: 'Congratulations!',
        slug: 'congratulations',
        internalLink: {
          route: this.args.currentStep.routeParams.route,
          models: this.args.currentStep.routeParams.models,
        },
        isActive: this.router.currentRouteName === this.args.currentStep.routeParams.route,
      },
    ];
  }

  get introductionTabs(): Tab[] {
    return [
      {
        icon: 'document-text',
        name: 'Instructions',
        slug: 'instructions',
        internalLink: {
          route: this.args.currentStep.routeParams.route,
          models: this.args.currentStep.routeParams.models,
        },
        isActive: this.router.currentRouteName === this.args.currentStep.routeParams.route,
      },
    ];
  }

  get setupTabs(): Tab[] {
    return [
      {
        icon: 'document-text',
        name: 'Instructions',
        slug: 'instructions',
        internalLink: {
          route: this.args.currentStep.routeParams.route,
          models: this.args.currentStep.routeParams.models,
        },
        isActive: this.router.currentRouteName === this.args.currentStep.routeParams.route,
      },
    ];
  }

  get stageTabs(): Tab[] {
    const tabs: Tab[] = [];

    tabs.push({
      icon: 'document-text',
      name: 'Instructions',
      slug: 'instructions',
      internalLink: {
        route: 'course.stage.instructions',
        models: this.args.currentStep.routeParams.models,
      },
      isActive: this.router.currentRouteName === 'course.stage.instructions',
    });

    tabs.push({
      icon: 'code',
      name: 'Code Examples',
      slug: 'code_examples',
      internalLink: {
        route: 'course.stage.code-examples',
        models: this.args.currentStep.routeParams.models,
      },
      isActive: this.router.currentRouteName === 'course.stage.code-examples',
    });

    // @ts-ignore
    if (this.args.currentStep.courseStage && this.args.currentStep.courseStage.hasScreencasts) {
      tabs.push({
        icon: 'play',
        name: 'Screencasts',
        slug: 'screencasts',
        internalLink: {
          route: 'course.stage.screencasts',
          models: this.args.currentStep.routeParams.models,
        },
        isActive: this.router.currentRouteName === 'course.stage.screencasts',
      });
    }

    // @ts-ignore
    if (this.args.currentStep.courseStage && this.args.currentStep.courseStage.course.hasConcepts) {
      tabs.push({
        icon: 'academic-cap',
        name: 'Concepts',
        slug: 'concepts',
        internalLink: {
          route: 'course.stage.concepts',
          models: this.args.currentStep.routeParams.models,
        },
        isActive: this.router.currentRouteName === 'course.stage.concepts',
      });
    }

    tabs.push({
      icon: 'chat-alt-2',
      name: 'Forum',
      slug: 'forum',
      externalLink: {
        url: this.args.course.forumUrl,
      },
      isActive: false,
    });

    return tabs;
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
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::TabList': typeof TabListComponent;
  }
}
