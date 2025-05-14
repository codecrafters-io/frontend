import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    stage: CourseStageModel;
  };
}

export default class StageListItemComponent extends Component<Signature> {
  get analysis() {
    // TODO: Make sure only the analysis for the selected language is returned
    return this.args.stage.communitySolutionsAnalyses[0];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsightsIndexPage::StageListItem': typeof StageListItemComponent;
  }
}
