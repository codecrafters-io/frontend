import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

class Action {
  constructor(linkText, callbackFn) {
    this.linkText = linkText;
    this.callbackFn = callbackFn;
  }
}

export default class PostCompletionPromptComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get actions() {
    const actions = [];

    if (this.solutionIsAvailableInUserLanguage && !this.args.courseStage.isFirst) {
      actions.push(
        new Action('view the solution', () => {
          return this.args.onViewSolutionButtonClick(this.args.courseStage);
        })
      );
    }

    if (this.args.courseStage.hasSourceWalkthrough) {
      actions.push(
        new Action(`view the official ${this.args.courseStage.course.shortName} source walkthrough`, () => {
          return this.args.onViewSourceWalkthroughButtonClick(this.args.courseStage);
        })
      );
    }

    if (this.isLastCompletedStage && !this.args.courseStage.isLast) {
      actions.push(new Action('continue to the next stage', this.args.onViewNextStageButtonClick));
    }

    return actions;
  }

  get actionsWithJoiners() {
    return this.actions.map((action, index) => {
      const isLast = index === this.actions.length - 1;
      const isPenultimate = index === this.actions.length - 2;

      return {
        ...action,
        joiner: isLast ? '.' : isPenultimate ? ' or ' : ', ',
      };
    });
  }

  get isLastCompletedStage() {
    return this.args.repository.highestCompletedStage === this.args.courseStage;
  }

  get solutionIsAvailableInUserLanguage() {
    return !!this.args.courseStage.hasSolutionForLanguage(this.args.repository.language);
  }
}
