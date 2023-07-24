import Component from '@glimmer/component';
import CourseDefinitionUpdateModel from 'codecrafters-frontend/models/course-definition-update';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    update: CourseDefinitionUpdateModel;
  };
};

export default class UpdateListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::UpdatesPage::UpdateListItem': typeof UpdateListItemComponent;
  }
}
