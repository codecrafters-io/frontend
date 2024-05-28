import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { Tab } from 'codecrafters-frontend/components/tabs';
// import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';
import type { CourseStageParticipationAnalysisStatistic } from 'codecrafters-frontend/models/course-stage-participation-analysis';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluator: CommunitySolutionEvaluatorModel;
  };
};

export default class AccuracySection extends Component<Signature> {
  @tracked activeTabSlug: 'false_positives' | 'false_negatives' | 'matches' = 'false_positives';

  // TODO: Figure out a "generic" statistic type rather than piggybacking off CourseStageParticipationAnalysis?
  get falseNegativeRateStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      title: 'False Negative Rate',
      label: 'false negatives',
      value: '80%',
      color: 'red',
      explanationMarkdown: 'The percentage of "fail" evaluations that did not match human values.',
    };
  }

  // TODO: Figure out a "generic" statistic type rather than piggybacking off CourseStageParticipationAnalysis?
  get falsePositiveRateStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      title: 'False Positive Rate',
      label: 'false positives',
      value: '80%',
      color: 'red',
      explanationMarkdown: 'The percentage of "pass" evaluations that did not match human values.',
    };
  }

  get tabs() {
    return [
      {
        slug: 'false_positives',
        title: 'False Positives',
        icon: 'x',
      },
      {
        slug: 'false_negatives',
        title: 'False Negatives',
        icon: 'exclamation',
      },
      {
        slug: 'matches',
        title: 'Matches',
        icon: 'check',
      },
    ];
  }

  @action
  handleTabChange(tab: Tab) {
    this.activeTabSlug = tab.slug as 'false_positives' | 'false_negatives' | 'matches';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleEvaluatorPage::AccuracySection': typeof AccuracySection;
  }
}
