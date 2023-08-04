import Component from '@glimmer/component';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    courseTesterVersion: CourseTesterVersionModel;
  };
};

export default class VersionListItemComponent extends Component<Signature> {
  @service declare router: RouterService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::TesterVersionsPage::VersionListItem': typeof VersionListItemComponent;
  }
}
