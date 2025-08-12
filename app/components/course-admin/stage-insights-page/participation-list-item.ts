import Component from '@glimmer/component';
import type CourseStageParticipationModel from 'codecrafters-frontend/models/course-stage-participation';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    participation: CourseStageParticipationModel;
  };
}

export default class ParticipationListItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::ParticipationListItem': typeof ParticipationListItem;
  }
}
