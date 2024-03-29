import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
  };
};

export default class CommunitySolutionCardHeaderComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::Header': typeof CommunitySolutionCardHeaderComponent;
  }
}
