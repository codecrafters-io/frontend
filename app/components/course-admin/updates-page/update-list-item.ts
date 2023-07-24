import Component from '@glimmer/component';
import CourseDefinitionUpdateModel from 'codecrafters-frontend/models/course-definition-update';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    update: CourseDefinitionUpdateModel;
  };
};

export default class UpdateListItemComponent extends Component<Signature> {
  @service declare router: RouterService;

  @action
  handleClick() {
    this.router.transitionTo('course-admin.update', this.args.update.course.slug, this.args.update.id);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::UpdatesPage::UpdateListItem': typeof UpdateListItemComponent;
  }
}
