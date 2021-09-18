import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import showdown from 'showdown';

export default class CoursePageStepListStageItemComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get instructionsHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.instructionsMarkdownTemplate));
  }

  get instructionsMarkdownTemplate() {
    return `
Congratulations are in order. Only ~{{completion_percentage}}% of users that attempt this challenge end up completing all stages, and you're one of them!

If this is your first time completing a CodeCrafters challenge, you'll receive access to the following:

- **Your own profile page.** Like [this one](). This might take 24 hours to activate, it'll be accessible at
[codecrafters.io/users/{{username}}](codecrafters.io/users/{{username}}).
- **Supervotes**. You can use these to [vote on upcoming CodeCrafters challenges](https://vote.codecrafters.io/). Just
like your profile page, this might take 24 hours to activate.

Here's what you can do next:

- **Try a different language.** Use the dropdown at the top-right of the page to do this. You won't lose any progress,
and you can always switch between languages.
- **Try a different approach.** Want to use the same language, but try a different approach? The dropdown at the
top-right should have an option for that too!
- **Refine your code.** If you'd like to clean things up, just push new commits to the repository and we'll run tests
just like before.

If you've got any feedback or feature requests, feel free to let us know at
[hello@codecrafters.io](mailto:hello@codecrafters.io). We respond to every single email.
`;
  }
}
