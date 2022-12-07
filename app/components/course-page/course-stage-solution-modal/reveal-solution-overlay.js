import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class RevealSolutionOverlayComponent extends Component {
  @service currentUser;

  get currentUserIsStaff() {
    return this.currentUser.record.isStaff;
  }

  get communitySolutionsAreAvailableForOtherLanguages() {
    return this.args.courseStage.hasCommunitySolutionsForLanguagesOtherThan(this.args.requestedSolutionLanguage);
  }

  get instructionsText() {
    if (this.suggestedActions.length === 0) {
      return `Looks like you haven't completed this stage yet. Just a heads up, this tab will expose solutions.`;
    } else if (this.suggestedActions.includes('switch_language') && this.suggestedActions.includes('view_comments')) {
      return `Looks like you haven't  completed this stage in ${this.args.repository.language.name} yet. Maybe peek at the comments for hints, or check out other language solutions?`;
    } else if (this.suggestedActions.includes('switch_language')) {
      return `Looks like you haven't completed this stage in ${this.args.repository.language.name} yet. In case you wanted a hint, you can also check out solutions in other languages. Could inspire you.`;
    } else if (this.suggestedActions.includes('view_comments')) {
      return `Looks like you haven't completed this stage yet. Maybe peek at the comments first, in case there are hints?`;
    } else {
      throw `Unexpected suggested actions for blurred overlay`;
    }
  }

  get suggestedActions() {
    const actions = [];

    if (this.args.courseStage.hasApprovedComments) {
      actions.push('view_comments');
    }

    // TODO: Use verified solutions for view_verified_solution intent
    if (this.args.intent === 'view_community_solutions' && this.communitySolutionsAreAvailableForOtherLanguages) {
      actions.push('switch_language');
    }

    return actions;
  }

  get textForRevealSolutionsButton() {
    // TODO: Change to singular version for verified solutions
    if (this.suggestedActions.includes('switch_language')) {
      return `Reveal ${this.args.repository.language.name} solutions`;
    } else if (this.suggestedActions.length === 0) {
      return `Just taking a peek`;
    } else {
      return 'Reveal solutions';
    }
  }

  get textForSwitchLanguageButton() {
    if (this.suggestedActions.length === 1 && this.suggestedActions.includes('switch_language')) {
      return `Good idea`;
    } else {
      return 'Another language';
    }
  }
}
