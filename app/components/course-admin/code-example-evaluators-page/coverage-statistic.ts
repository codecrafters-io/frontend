import Component from '@glimmer/component';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';
import type { CommunitySolutionsAnalysisStatistic } from 'codecrafters-frontend/models/community-solutions-analysis';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    evaluator: CommunitySolutionEvaluatorModel;
  };
}

export default class CoverageStatistic extends Component<Signature> {
  get coverageColor(): 'green' | 'yellow' | 'red' | 'gray' {
    const percentage = this.args.evaluator.failRatePercentage;

    if (percentage === null) {
      return 'gray';
    }

    if (percentage >= 10) {
      return 'green';
    } else if (percentage >= 5) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  get coverageStatistic(): CommunitySolutionsAnalysisStatistic {
    const percentage = this.args.evaluator.failRatePercentage;

    return {
      title: 'Coverage',
      label: 'coverage',
      value: percentage !== null ? `${percentage}%` : 'No evaluations',
      color: this.coverageColor,
      explanationMarkdown: 'The percentage of evaluations that resulted in "fail" (issues detected).',
    };
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleEvaluatorsPage::CoverageStatistic': typeof CoverageStatistic;
  }
}
