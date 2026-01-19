import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    isComplete: boolean;
    stage: CourseStageModel;
  };
}

export default class StageListItem extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get routeAndModels(): { route: string; models: string[] } {
    if (this.args.stage.isFirst && !this.args.isComplete) {
      return { route: 'course.introduction', models: [this.args.stage.course.slug] };
    } else {
      return { route: 'course.stage.instructions', models: [this.args.stage.course.slug, this.args.stage.slug] };
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::StageListItem': typeof StageListItem;
  }
}
