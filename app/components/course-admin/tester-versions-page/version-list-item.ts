import Component from '@glimmer/component';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    courseTesterVersion: CourseTesterVersionModel;
    latestTesterVersion: CourseTesterVersionModel;
  };
};

export default class VersionListItemComponent extends Component<Signature> {
  @tracked isActivating = false;

  async activate() {
    if (!this.isActivating) {
      this.isActivating = true;

      // @ts-ignore
      await this.args.courseTesterVersion.activate();

      this.isActivating = false;
    }
  }

  @action 
  async handleActivateButtonClick() {
    if (this.args.courseTesterVersion.isLatest) {
      await this.activate();
    } else {
      const message = `${this.args.latestTesterVersion.tagName} is the latest version. Are you sure you want to activate ${this.args.courseTesterVersion.tagName} instead?`;
      if (window.confirm(message)) {
        await this.activate();
      }
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::TesterVersionsPage::VersionListItem': typeof VersionListItemComponent;
  }
}
