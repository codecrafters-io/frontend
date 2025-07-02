import Component from '@glimmer/component';
// @ts-expect-error not ts-ified yet
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import MarkdownToHtml from 'codecrafters-frontend/helpers/markdown-to-html';
import svgJar from 'ember-svg-jar/helpers/svg-jar';
import VoteButton from 'codecrafters-frontend/components/roadmap-page/idea-card/vote-button';
import { action } from '@ember/object';
import { eq } from 'ember-truth-helpers';
import { inject as service } from '@ember/service';
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
      class='group bg-white dark:bg-gray-850 p-5 rounded-md shadow-sm border
        {{if this.userHasVoted "border-gray-300 dark:border-gray-700" "border-gray-200 dark:border-white/5"}}
        relative
        {{if @courseIdea.developmentStatusIsReleased "opacity-50"}}'
      data-test-course-idea-card
    >
      <div class='flex items-start gap-3'>
        <div class='flex flex-col gap-1 flex-grow'>
          <div class='flex items-center gap-2 flex-wrap mt-0.5 mb-2.5'>
            <div class='text-gray-700 dark:text-gray-200 font-bold text-xl tracking-tight' data-test-course-idea-name>
              {{@courseIdea.name}}
            </div>

            {{#if @courseIdea.developmentStatusIsReleased}}
              <Pill @color='blue' data-test-development-status-pill>
                <div class='flex items-center gap-1'>
                  {{svgJar 'check-circle' class='w-3 fill-current'}}
                  Released
                </div>
                <EmberTooltip @text='This challenge is now available! Visit the catalog to try it out.' />
              </Pill>
            {{else if @courseIdea.developmentStatusIsInProgress}}
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
            {{else if this.userHasVoted}}
              <Pill @color='green' data-test-development-status-pill>
                <div class='flex items-center gap-1'>
                  {{svgJar 'thumb-up' class='w-3 fill-current'}}
                  Voted
                </div>
                <EmberTooltip @text="You've voted for this idea! We'll notify you when it launches." />
              </Pill>
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

        <div class='flex flex-col gap-2 items-end flex-shrink-0'>
          <VoteButton @idea={{@courseIdea}} @userHasVoted={{this.userHasVoted}} {{on 'click' this.handleVoteButtonClick}} />

          <div class='flex items-center gap-1'>
            <div class='{{if this.userHasVoted "text-teal-600" "text-gray-400 dark:text-gray-600"}} text-xs' data-test-vote-count>
              {{@courseIdea.votesCount}}
              {{if (eq @courseIdea.votesCount 1) 'vote' 'votes'}}
            </div>
          </div>
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
