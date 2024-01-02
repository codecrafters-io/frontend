import Component from '@glimmer/component';
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import MarkdownToHtml from 'codecrafters-frontend/helpers/markdown-to-html';
import svgJar from 'ember-svg-jar/helpers/svg-jar';
import VoteButton from 'codecrafters-frontend/components/vote-page/idea-card/vote-button';
import UnvoteButton from 'codecrafters-frontend/components/vote-page/idea-card/unvote-button';
import { action } from '@ember/object';
import { and } from 'ember-truth-helpers';
import { inject as service } from '@ember/service';
import { LinkTo } from '@ember/routing';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';

export default class CourseIdeaCardComponent extends Component {
  @service authenticator;
  @service store;

  @tracked isVotingOrUnvoting = false;

  get userHasVoted() {
    if (this.authenticator.isAnonymous) {
      return false;
    }

    return this.authenticator.currentUser.courseIdeaVotes.mapBy('courseIdea').includes(this.args.courseIdea);
  }

  @action
  async handleUnvoteButtonClick() {
    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;
    await this.args.courseIdea.unvote();
    this.isVotingOrUnvoting = false;
  }

  @action
  async handleVoteButtonClick() {
    if (this.authenticator.isAnonymous) {
      this.authenticator.initiateLogin();

      return;
    }

    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;

    if (this.userHasVoted) {
      await this.args.courseIdea.unvote();
    } else {
      await this.args.courseIdea.vote();
    }

    this.isVotingOrUnvoting = false;
  }

  <template><div
  class='group bg-white p-5 rounded-md shadow-sm flex flex-col justify-between border {{if this.userHasVoted "border-gray-300"}} relative'
  data-test-course-idea-card
>
  {{! Text }}
  <div class='mb-4'>
    <div class='flex items-start justify-between mb-3'>
      <div class='text-gray-700 mr-2 mb-0.5 font-bold text-xl tracking-tight' data-test-course-idea-name>
        {{@courseIdea.name}}
      </div>

      {{#if @courseIdea.developmentStatusIsInProgress}}
        <div
          class='text-xs text-white font-semibold bg-yellow-500 rounded px-1.5 py-1 ml-3 mt-0.5 flex items-center'
          data-test-development-status-label
        >
          in progress
          {{svgJar 'shield-check' class='w-4 ml-1 fill-current'}}
          {{#if this.userHasVoted}}
            <EmberTooltip @text="We're currently building this challenge. We'll notify you when it launches." />
          {{else}}
            <EmberTooltip @text="We're currently building this challenge. Upvote this idea to be notified when it launches." />
          {{/if}}
        </div>
      {{else if @courseIdea.developmentStatusIsReleased}}
        <div
          class='text-xs text-white font-semibold bg-teal-500 rounded px-1.5 py-1 ml-3 mt-0.5 flex items-center'
          data-test-development-status-label
        >
          <LinkTo @route='catalog'>released</LinkTo>
          {{svgJar 'check' class='w-4 ml-1 fill-current'}}
          <EmberTooltip @text='This challenge is now available! Visit the catalog to try it out.' />
        </div>
      {{else if this.userHasVoted}}
        <div class='h-7 w-7 bg-teal-500 rounded flex items-center justify-center'>
          {{svgJar 'chevron-up' class='w-7 fill-current text-white'}}
        </div>
      {{else if @courseIdea.isNewlyCreated}}
        <div class='text-xs text-teal-500 font-semibold border border-teal-500 rounded px-1.5 py-1 ml-3 mt-0.5' data-test-development-status-label>
          new
          <EmberTooltip @text='This is a recently added idea! Vote to help us decide which ideas to prioritize.' />
        </div>
      {{/if}}
    </div>
    <div class='prose prose-sm'>
      {{MarkdownToHtml @courseIdea.descriptionMarkdown}}
    </div>
  </div>

  {{! Footer Controls }}
  <div class='flex items-center justify-between'>
    <div class='flex items-center'>
      <VoteButton @idea={{@courseIdea}} @userHasVoted={{this.userHasVoted}} {{on 'click' this.handleVoteButtonClick}} class='mr-2' />

      {{#if (and this.userHasVoted this.isVotingOrUnvoting)}}
        <svg class='animate-spin ml-2 w-3 text-teal-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
          <circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle>
          <path
            class='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      {{else if this.userHasVoted}}
        <UnvoteButton @courseIdea={{@courseIdea}} {{on 'click' this.handleUnvoteButtonClick}} />
      {{/if}}
    </div>
  </div>
</div></template>
}
