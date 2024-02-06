import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

type Signature = {
  Element: HTMLAnchorElement;

  Args: {
    isComplete: boolean;
    stage: CourseStageModel;
  };
};

export default class StageListItemComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::StageListItem': typeof StageListItemComponent;
  }
}
