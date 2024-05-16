import Component from '@glimmer/component';
import type CommunitySolutionEvalutionModel from 'codecrafters-frontend/models/community-solution-evaluation';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvalutionModel;
    isExpanded: boolean;
    onCloseButtonClick: () => void;
  };
};

export default class EvaluationCardHeaderComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard::Header': typeof EvaluationCardHeaderComponent;
  }
}
