import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type SolutionComparisonModel from 'codecrafters-frontend/models/solution-comparison';
import type UserModel from 'codecrafters-frontend/models/user';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    comparison: SolutionComparisonModel;
    firstUser: UserModel;
  };
};

export default class ComparisonCard extends Component<Signature> {
  @tracked isExpanded = false;

  get firstUser() {
    return this.args.firstUser;
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get result() {
    if (this.args.comparison.firstSolution.user.id === this.args.firstUser.id) {
      return this.args.comparison.result;
    } else {
      return this.args.comparison.result === 'first_wins' ? 'second_wins' : 'first_wins';
    }
  }

  get secondUser() {
    if (this.args.comparison.firstSolution.user.id === this.args.firstUser.id) {
      return this.args.comparison.secondSolution.user;
    } else {
      return this.args.comparison.firstSolution.user;
    }
  }

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.isExpanded = false;
    });
  }

  @action
  handleExpandButtonClick() {
    next(() => {
      this.isExpanded = true;
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::ComparisonCard': typeof ComparisonCard;
  }
}
