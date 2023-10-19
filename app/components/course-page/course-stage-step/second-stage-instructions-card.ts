import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import CourseStageScreencastModel from 'codecrafters-frontend/models/course-stage-screencast';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: {
      course: {
        secondStage: {
          position: number;
          solutions: {
            changedFiles: {
              filename: string;
            }[];
            language: unknown;
          }[];
          screencasts: CourseStageScreencastModel[];
        };
      };
      language: unknown;
    };
    courseStage: {
      position: number;
      screencasts: CourseStageScreencastModel[];
    };
  };
}

export default class SecondStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;
  @service declare router: RouterService;

  get submitChangesInstructionsMarkdown() {
    return `\`\`\`
git add .
git commit -m "pass 2nd stage" # any msg
git push origin master
\`\`\``;
  }
}
