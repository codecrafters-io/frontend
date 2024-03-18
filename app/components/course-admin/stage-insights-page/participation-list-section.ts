import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageParticipationModel from 'codecrafters-frontend/models/course-stage-participation';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    title: string;
    tooltipText: string;
    participations: CourseStageParticipationModel[];
  };
};

export default class ParticipationListSectionComponent extends Component<Signature> {
  @tracked shouldShowParticipationsWithSingleAttempt = false;

  get filteredParticipations() {
    if (this.shouldShowParticipationsWithSingleAttempt) {
      return this.args.participations;
    } else {
      return this.args.participations.filter((participation) => participation.attemptsCount > 1);
    }
  }

  @action
  handleShowParticipationsWithSingleAttemptToggle() {
    this.shouldShowParticipationsWithSingleAttempt = !this.shouldShowParticipationsWithSingleAttempt;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::ParticipationListSection': typeof ParticipationListSectionComponent;
  }
}
