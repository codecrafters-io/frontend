import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import showdown from 'showdown';
import Store from '@ember-data/store';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: {
      course: {
        firstStage: {
          solutions: {
            changedFiles: {
              filename: string;
              diff: string;
            }[];
            language: {
              slug: string;
            };
          }[];
        };
      };
      language: unknown;
    };
  };
}

export default class FirstStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

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

  get solution() {
    return this.args.repository.course.firstStage.solutions.find((solution) => solution.language === this.args.repository.language);
  }
}
