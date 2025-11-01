import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
    descriptionMarkdown: string;
    stages: CourseStageModel[];
    isCollapsedByDefault?: boolean;
  };
}

export default class CourseOverviewPageStageListCard extends Component<Signature> {
  @tracked isExpanded = !this.args.isCollapsedByDefault;

  @action
  handleExpandClick() {
    this.isExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StageListCard': typeof CourseOverviewPageStageListCard;
  }
}
