import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {};
};

export default class UpdateListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::UpdatesPage::UpdateListItem': typeof UpdateListItemComponent;
  }
}
