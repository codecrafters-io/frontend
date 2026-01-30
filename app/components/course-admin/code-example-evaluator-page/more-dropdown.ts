import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    onEvaluateMoreSolutionsClick: () => void;
  };
}

export default class MoreDropdown extends Component<Signature> {
  @action
  handleEvaluateMoreSolutionsClick(dropdownActions: { close: () => void }) {
    this.args.onEvaluateMoreSolutionsClick();
    dropdownActions.close();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleEvaluatorPage::MoreDropdown': typeof MoreDropdown;
  }
}
