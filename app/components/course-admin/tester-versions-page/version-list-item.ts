import Component from '@glimmer/component';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    courseTesterVersion: CourseTesterVersionModel;
  };
};

export default class VersionListItemComponent extends Component<Signature> {
  @service declare router: RouterService;
  @service declare store: Store;

  @tracked isActivating = false;

  get activationConfirmationMessage() {
    // @ts-ignore
    const latestTesterVersion = this.args.courseTesterVersion.course.latestTesterVersion;

    if (latestTesterVersion) {
      return `${latestTesterVersion.tagName} is the latest version. Are you sure you want to activate ${this.args.courseTesterVersion.tagName} instead?`;
    } else {
      return `${this.args.courseTesterVersion.tagName} is not the latest version. Are you sure you want to activate it?`;
    }
  }

  get provisionedTestRunnersCountTooltipCopy() {
    if (this.args.courseTesterVersion.provisionedTestRunnersCount === 1) {
      return `This version has ${this.args.courseTesterVersion.provisionedTestRunnersCount} provisioned test runner. You can deprovision this if you want users to use the active version instead.`;
    } else {
      return `This version has ${this.args.courseTesterVersion.provisionedTestRunnersCount} provisioned test runners. You can deprovision these if you want users to use the active version instead.`;
    }
  }

  async activate() {
    if (!this.isActivating) {
      this.isActivating = true;

      // @ts-ignore
      await this.args.courseTesterVersion.activate();

      await this.store.query('course-tester-version', {
        // @ts-ignore
        course_id: this.args.courseTesterVersion.course.id,
        include: ['course', 'activator'].join(','),
      });

      this.isActivating = false;
    }
  }

  @action
  async handleActivateButtonClick() {
    if (this.args.courseTesterVersion.isLatest) {
      await this.activate();

      return;
    }

    if (window.confirm(this.activationConfirmationMessage)) {
      await this.activate();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::TesterVersionsPage::VersionListItem': typeof VersionListItemComponent;
  }
}
