import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class CommunitySolutionCardHeaderLabel extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::HeaderLabel': typeof CommunitySolutionCardHeaderLabel;
  }
}
