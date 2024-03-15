import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageParticipationModel from 'codecrafters-frontend/models/course-stage-participation';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    participations: CourseStageParticipationModel[];
  };
};

export default class ParticipationListComponent extends Component<Signature> {
  @tracked visibleParticipationsCount = 10;

  get hasMoreParticipations() {
    return this.visibleParticipationsCount < this.args.participations.length;
  }

  get isCollapsible() {
    return this.visibleParticipations.length > 10;
  }

  get visibleParticipations() {
    return this.args.participations.slice(0, this.visibleParticipationsCount);
  }

  @action
  handleCollapseButtonClick() {
    this.visibleParticipationsCount = 10;
  }

  @action
  handleShowMoreButtonClick() {
    this.visibleParticipationsCount = Math.min(this.visibleParticipationsCount + 10, this.args.participations.length);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::ParticipationList': typeof ParticipationListComponent;
  }
}
