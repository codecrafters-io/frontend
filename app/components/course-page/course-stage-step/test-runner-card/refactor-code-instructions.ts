import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
  };
}

export default class RefactorCodeInstructionsComponent extends Component<Signature> {
  static clientTypeToVariantMap = {
    cli: 'codecrafters cli',
    git: 'git',
  };

  @tracked alternateClientTypeIsSelected = false;

  get commandsForCli() {
    return ['codecrafters test # Visit https://codecrafters.io/cli to install'];
  }

  get commandsForGit() {
    return ['git add .', 'git commit --allow-empty -m "run tests" # any message', 'git push origin master'];
  }

  get commandsForSelectedClientType() {
    if (this.recommendedClientType === 'cli') {
      return this.alternateClientTypeIsSelected ? this.commandsForGit : this.commandsForCli;
    } else {
      return this.alternateClientTypeIsSelected ? this.commandsForCli : this.commandsForGit;
    }
  }

  get recommendedClientType() {
    if (this.args.currentStep.courseStage.isFirst) {
      return 'git';
    } else {
      return 'cli';
    }
  }

  get selectedClientType() {
    if (this.alternateClientTypeIsSelected) {
      return this.recommendedClientType === 'cli' ? 'git' : 'cli';
    } else {
      return this.recommendedClientType;
    }
  }

  get selectedVariant() {
    return RefactorCodeInstructionsComponent.clientTypeToVariantMap[this.selectedClientType];
  }

  @action
  handleVariantSelect(variant: string) {
    const clientType = variant === 'git' ? 'git' : 'cli'; // variant can be 'git' or 'codecrafters cli'
    this.alternateClientTypeIsSelected = clientType !== this.recommendedClientType;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestRunnerCard::RefactorCodeInstructions': typeof RefactorCodeInstructionsComponent;
  }
}
