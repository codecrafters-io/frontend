import Component from '@glimmer/component';
import svgJar from 'ember-svg-jar/helpers/svg-jar';
import { action } from '@ember/object';
import { createPopup } from '@typeform/embed';
import { inject as service } from '@ember/service';
// @ts-expect-error not ts-ified yet
import { on } from '@ember/modifier';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class SubmitCourseIdeaCardComponent extends Component {
  @service declare authenticator: AuthenticatorService;

  @action
  handleClick() {
    createPopup('kJNvFVQM', {
      hidden: {
        github_username: this.authenticator.currentUser!.username,
      },
    }).toggle();
  }

  <template>
    <div
      class='group border-2 border-gray-200 border-dashed dark:border-white/5 hover:border-gray-400 dark:hover:border-gray-700 px-5 py-10 lg:py-20 rounded-md flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
      data-test-submit-course-idea-card
      role='button'
      {{on 'click' this.handleClick}}
    >
      {{svgJar 'plus' class='w-12 h-12 fill-current'}}

      <div class='mt-1 font-bold text-xl tracking-tight'>
        Submit Idea
      </div>
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'RoadmapPage::SubmitCourseIdeaCard': typeof SubmitCourseIdeaCardComponent;
  }
}
