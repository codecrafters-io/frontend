import Component from '@glimmer/component';
// @ts-expect-error not ts-ified yet
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import MarkdownToHtml from 'codecrafters-frontend/helpers/markdown-to-html';
import svgJar from 'ember-svg-jar/helpers/svg-jar';
import VoteButton from 'codecrafters-frontend/components/vote-page/idea-card/vote-button';
import UnvoteButton from 'codecrafters-frontend/components/vote-page/idea-card/unvote-button';
import { action } from '@ember/object';
import { and } from 'ember-truth-helpers';
import { inject as service } from '@ember/service';
import { LinkTo } from '@ember/routing';
// @ts-expect-error not ts-ified yet
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    courseIdea: CourseIdeaModel;
  };
};

export default class CourseIdeaCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked isVotingOrUnvoting = false;

  get userHasVoted() {
    if (this.authenticator.isAnonymous) {
      return false;
    }

    return this.authenticator.currentUser!.courseIdeaVotes.mapBy('courseIdea').includes(this.args.courseIdea);
  }

  @action
  async handleUnvoteButtonClick() {
    if (this.isVotingOrUnvoting) {
      return;
    }

    this.isVotingOrUnvoting = true;
    await this.args.courseIdea.unvote({});
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
      await this.args.courseIdea.unvote({});
    } else {
      await this.args.courseIdea.vote();
    }

    this.isVotingOrUnvoting = false;
  }

  <template>
    <div
      class='group bg-white dark:bg-gray-850 p-5 rounded-md shadow-sm flex border
        {{if this.userHasVoted "border-gray-300 dark:border-gray-700" "border-gray-200 dark:border-white/5"}}
        relative
        {{if @courseIdea.developmentStatusIsReleased "opacity-50"}}'
      data-test-course-idea-card
    >
      {{! Text }}
      <div class='w-full'>
        <div class='flex items-center flex-wrap gap-2 mb-2'>
          <div class='text-gray-700 dark:text-gray-200 font-bold text-xl tracking-tight' data-test-course-idea-name>
            {{@courseIdea.name}}
          </div>

          {{#if @courseIdea.developmentStatusIsInProgress}}
            <span
              class='text-xs text-white font-semibold bg-yellow-500 dark:bg-yellow-600 rounded px-1.5 py-1 flex items-center'
              data-test-development-status-label
            >
              in progress
              {{svgJar 'shield-check' class='w-4 fill-current'}}
              {{#if this.userHasVoted}}
                <EmberTooltip @text="We're currently building this challenge. We'll notify you when it launches." />
              {{else}}
                <EmberTooltip @text="We're currently building this challenge. Upvote this idea to be notified when it launches." />
              {{/if}}
            </span>
          {{else if @courseIdea.developmentStatusIsReleased}}
            <span
              class='text-xs text-white font-semibold bg-teal-500 dark:bg-teal-600 rounded px-1.5 py-1 flex items-center'
              data-test-development-status-label
            >
              <LinkTo @route='catalog'>released</LinkTo>
              {{svgJar 'check' class='w-4 fill-current'}}
              <EmberTooltip @text='This challenge is now available! Visit the catalog to try it out.' />
            </span>
          {{else if this.userHasVoted}}
            <span
              class='text-xs text-white font-semibold bg-teal-500 dark:bg-teal-600 rounded px-1.5 py-1 flex items-center'
              data-test-development-status-label
            >
              {{svgJar 'thumb-up' class='w-4 mr-0.5 fill-current'}}
              Voted
              <EmberTooltip @text='You have voted for this idea. We will notify you when it is released.' />
            </span>
          {{else if @courseIdea.isNewlyCreated}}
            <div
              class='text-xs text-teal-500 font-semibold border border-teal-500 rounded px-1.5 py-1 inline-flex'
              data-test-development-status-label
            >
              New
              <EmberTooltip @text='This is a recently added idea! Vote to help us decide which ideas to prioritize.' />
            </div>
          {{/if}}
        </div>

        <div class='prose dark:prose-invert prose-sm pr-8'>
          {{MarkdownToHtml @courseIdea.descriptionMarkdown}}
        </div>
      </div>

      <div class='flex-shrink-0'>
        <VoteButton @idea={{@courseIdea}} @userHasVoted={{this.userHasVoted}} {{on 'click' this.handleVoteButtonClick}} />
      </div>
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'VotePage::CourseIdeaCard': typeof CourseIdeaCardComponent;
  }
}
