import Component from '@glimmer/component';
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import { eq } from 'ember-truth-helpers';
import { inject as service } from '@ember/service';
import svgJar from 'ember-svg-jar/helpers/svg-jar';

export default class VoteButtonComponent extends Component {
  @service authenticator;

  get renderedVotesCount() {
    return this.args.idea.votesCount;
  }

  <template>
    <button
      type='button'
      class='pr-2.5 pl-2 py-1.5 rounded shadow-sm flex items-center border
        {{if @userHasVoted "border-teal-500 hover:border-teal-600" "border-gray-300 hover:border-gray-400"}}
        transition-all duration-75 active:shadow active:border-teal-600'
      data-test-vote-button
      ...attributes
    >
      {{svgJar 'chevron-up' class='w-5 mr-1 text-teal-500'}}

      <span class='text-sm {{if @userHasVoted "text-teal-500" "text-gray-700"}} transition-all duration-75'>
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
