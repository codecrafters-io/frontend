import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type BadgeAwardModel from 'codecrafters-frontend/models/badge-award';
import type BadgeModel from 'codecrafters-frontend/models/badge';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    badgeAwards: BadgeAwardModel[];
  };
}

export default class EarnedBadgeNoticeComponent extends Component<Signature> {
  @tracked selectedBadge: BadgeModel | null = null;

  handleBadgeModalClose() {
    this.selectedBadge = null;
  }

  @action
  handleClick() {
    this.selectedBadge = this.args.badgeAwards[0]!.badge;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::EarnedBadgeNotice': typeof EarnedBadgeNoticeComponent;
  }
}
