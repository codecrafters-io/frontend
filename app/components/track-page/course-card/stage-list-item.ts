import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    isComplete: boolean;
    stage: CourseStageModel;
  };
}

export default class StageListItem extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::StageListItem': typeof StageListItem;
  }
}
