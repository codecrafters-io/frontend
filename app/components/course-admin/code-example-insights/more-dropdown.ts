import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onReRunEvaluatorsClick: () => void;
  };
}

export default class MoreDropdown extends Component<Signature> {
  @action
  handleReRunEvaluatorsClick(dropdownActions: { close: () => void }) {
    this.args.onReRunEvaluatorsClick();
    dropdownActions.close();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsights::MoreDropdown': typeof MoreDropdown;
  }
}
