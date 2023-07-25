import { action } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RouterService from '@ember/routing/router-service';
import showdown from 'showdown';
import Store from '@ember-data/store';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: {
      course: {
        secondStage: {
          position: number
          solutions: {
            changedFiles: {
              filename: string;
            }[];
            language: unknown;
          }[];
          screencasts: {}[];
        };
      };
      language: unknown;
      readmeUrl: string;
      defaultReadmeUrl: string;
      starterRepositoryUrl: string;
      defaultStarterRepositoryUrl: string;
    };
  };
}

export default class SecondStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;
  @service declare router: RouterService;

  get submitChangesInstructionsHTML() {
    return new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.submitChangesInstructionsMarkdown);
  }

  get submitChangesInstructionsMarkdown() {
    return `\`\`\`
git add .
git commit -m "pass 1st stage" # any msg
git push origin master
\`\`\``;
  }

  get hasScreencasts() {
    return this.args.repository.course.secondStage.screencasts.length > 0;
  }

  @action
  handleViewCodeExamplesButtonClicked() {
    this.router.transitionTo('course.stage.code-examples', this.args.repository.course.secondStage.position);
  }

  @action
  handleViewScreencastsButtonClicked() {
    this.router.transitionTo('course.stage.screencasts', this.args.repository.course.secondStage.position);
  }
}
