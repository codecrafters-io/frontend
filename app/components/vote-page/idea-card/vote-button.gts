import Component from '@glimmer/component';
// @ts-expect-error not ts-ified yet
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import { eq } from 'ember-truth-helpers';
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
      class='pr-2.5 pl-2 py-1.5 rounded shadow-sm flex items-center border
        {{if
          @userHasVoted
          "border-teal-500 hover:border-teal-600"
          "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
        }}
        transition-all duration-75 active:shadow active:border-teal-600'
      data-test-vote-button
      ...attributes
    >
      {{svgJar 'chevron-up' class='w-5 mr-1 text-teal-500'}}

      <span class='text-sm {{if @userHasVoted "text-teal-500" "text-gray-700 dark:text-gray-300"}} transition-all duration-75'>
        <span class='font-semibold'>{{this.renderedVotesCount}}</span>

        {{#if (eq this.renderedVotesCount 1)}}
          vote
        {{else}}
          votes
        {{/if}}
      </span>

      {{#if this.authenticator.isAnonymous}}
        <EmberTooltip @text='Click to login via GitHub' />
      {{/if}}
    </button>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'VotePage::IdeaCard::VoteButton': typeof VoteButtonComponent;
  }
}
