import Component from '@glimmer/component';
// @ts-expect-error not ts-ified yet
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import MarkdownToHtml from 'codecrafters-frontend/helpers/markdown-to-html';
import svgJar from 'ember-svg-jar/helpers/svg-jar';
import VoteButton from 'codecrafters-frontend/components/roadmap-page/idea-card/vote-button';
import UnvoteButton from 'codecrafters-frontend/components/roadmap-page/idea-card/unvote-button';
import { action } from '@ember/object';
import { and } from 'ember-truth-helpers';
import { inject as service } from '@ember/service';
import { LinkTo } from '@ember/routing';
// @ts-expect-error not ts-ified yet
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import Pill from 'codecrafters-frontend/components/pill';
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
      class='group bg-white dark:bg-gray-850 p-5 rounded-md shadow-sm flex flex-col justify-between border
        {{if this.userHasVoted "border-gray-300 dark:border-gray-700" "border-gray-200 dark:border-white/5"}}
        relative
        {{if @courseIdea.developmentStatusIsReleased "opacity-50"}}'
      data-test-course-idea-card
    >
      {{! Text }}
      <div class='mb-4'>
        <div class='flex items-center gap-2 mb-3'>
          <div class='text-gray-700 dark:text-gray-200 font-bold text-xl tracking-tight' data-test-course-idea-name>
            {{@courseIdea.name}}
          </div>

          {{#if @courseIdea.developmentStatusIsInProgress}}
            <Pill @color='yellow' data-test-development-status-pill>
              <div class='flex items-center gap-1'>
                {{svgJar 'shield-check' class='w-3 fill-current'}}
                In Progress
              </div>

              {{#if this.userHasVoted}}
                <EmberTooltip @text="We're currently building this challenge. We'll notify you when it launches." />
              {{else}}
                <EmberTooltip @text="We're currently building this challenge. Upvote this idea to be notified when it launches." />
              {{/if}}
            </Pill>
          {{else if @courseIdea.developmentStatusIsReleased}}
            <LinkTo @route='catalog'>
              <Pill @color='green' data-test-development-status-pill>
                <div class='flex items-center gap-1'>
                  {{svgJar 'check' class='w-3 fill-current'}}
                  Released
                </div>
                <EmberTooltip @text='This challenge is now available! Visit the catalog to try it out.' />
              </Pill>
            </LinkTo>
          {{else if this.userHasVoted}}
            <div class='h-7 w-7 bg-teal-500 dark:bg-teal-600 rounded flex items-center justify-center'>
              {{svgJar 'chevron-up' class='w-7 fill-current text-white'}}
            </div>
          {{else if @courseIdea.isNewlyCreated}}
            <Pill @color='green' data-test-development-status-pill>
              New
              <EmberTooltip @text='This is a recently added idea! Vote to help us decide which ideas to prioritize.' />
            </Pill>
          {{/if}}
        </div>
        <div class='prose dark:prose-invert prose-sm'>
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
            <UnvoteButton {{on 'click' this.handleUnvoteButtonClick}} />
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'RoadmapPage::CourseIdeaCard': typeof CourseIdeaCardComponent;
  }
}
