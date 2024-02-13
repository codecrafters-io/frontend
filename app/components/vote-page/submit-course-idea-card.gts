import Component from '@glimmer/component';
import svgJar from 'ember-svg-jar/helpers/svg-jar';
import { action } from '@ember/object';
import { createPopup } from '@typeform/embed';
import { inject as service } from '@ember/service';
import { on } from '@ember/modifier';

export default class SubmitCourseIdeaCardComponent extends Component {
  @service authenticator;

  @action
  handleClick() {
    createPopup('kJNvFVQM', {
      hidden: {
        github_username: this.authenticator.currentUser.username,
      },
    }).toggle();
  }

  <template>
    <div
      class='group border-2 border-dashed hover:border-gray-400 px-5 py-10 lg:py-20 rounded-md flex flex-col items-center justify-center text-gray-400 hover:text-gray-600'
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
