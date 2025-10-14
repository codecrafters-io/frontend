import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    language: LanguageModel;
    stage: CourseStageModel;
  };
}

export default class StageListItem extends Component<Signature> {
  get analysis() {
    return this.args.stage.communitySolutionsAnalyses.find((item) => item.language === this.args.language);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsightsIndexPage::StageListItem': typeof StageListItem;
  }
}
