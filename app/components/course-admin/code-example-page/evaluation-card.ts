import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { Signature as TabsComponentSignature } from 'codecrafters-frontend/components/tabs';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvaluationModel;
  };
};

export default class EvaluationCard extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @tracked isExpanded = false;

  get accessibleTabsSlugs() {
    if (this.authenticator.currentUser!.isStaff) {
      return ['evaluation', 'prompt', 'trusted-evaluation'];
    } else {
      return ['evaluation', 'prompt'];
    }
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get tabs(): TabsComponentSignature['Args']['tabs'] {
    const allTabs = [
      {
        slug: 'trusted-evaluation',
        title: 'Trusted Evaluation',
        icon: 'shield-check',
      },
      {
        slug: 'evaluation',
        title: 'Evaluation',
        icon: 'academic-cap',
      },
      {
        slug: 'prompt',
        title: 'Prompt',
        icon: 'document-text',
      },
    ];

    return allTabs.filter((tab) => this.accessibleTabsSlugs.includes(tab.slug));
  }

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.isExpanded = false;
    });
  }

  @action
  handleExpandButtonClick() {
    this.args.evaluation.fetchLogsFileContentsIfNeeded();
    this.args.evaluation.fetchPromptFileContentsIfNeeded();

    next(() => {
      this.isExpanded = true;
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard': typeof EvaluationCard;
  }
}
