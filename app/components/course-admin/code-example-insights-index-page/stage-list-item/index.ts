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
    // Since we're clearing the store before fetching new analyses,
    // we can safely use the first analysis (if any)
    return this.args.stage.communitySolutionsAnalyses[0];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsightsIndexPage::StageListItem': typeof StageListItemComponent;
  }
}
