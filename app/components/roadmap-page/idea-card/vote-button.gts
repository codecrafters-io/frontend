import Component from '@glimmer/component';
// @ts-expect-error not ts-ified yet
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import { concat } from '@ember/string';
import { inject as service } from '@ember/service';
import svgJar from 'ember-svg-jar/helpers/svg-jar';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';

export type Signature = {
  Element: HTMLButtonElement;

  Args: {
    idea: CourseIdeaModel | CourseExtensionIdeaModel;
    userHasVoted: boolean;
  };
};

export default class VoteButtonComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get renderedVotesCount() {
    return this.args.idea.votesCount;
  }

  <template>
    <button
      type='button'
      class='px-1.5 py-1 rounded shadow-sm flex items-center border
        {{if @userHasVoted "border-teal-500" "border-gray-300 dark:border-gray-700"}}
        transition-all duration-75 group/vote-button'
      data-test-vote-button
      ...attributes
    >
      <span
        class={{if
          @userHasVoted
          'text-teal-500 group-hover/vote-button:text-teal-600'
          'text-gray-400 dark:text-gray-600 group-hover/vote-button:text-gray-500'
        }}
      >
        {{svgJar 'thumb-up' class='w-5 fill-current'}}
      </span>

      {{#if this.authenticator.isAnonymous}}
        <EmberTooltip @text='Click to login via GitHub' />
      {{/if}}
    </button>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'RoadmapPage::IdeaCard::VoteButton': typeof VoteButtonComponent;
  }
}
