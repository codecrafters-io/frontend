import Component from '@glimmer/component';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
  };
};

export default class AutofixResultComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixSection::AutofixResult': typeof AutofixResultComponent;
  }
}
