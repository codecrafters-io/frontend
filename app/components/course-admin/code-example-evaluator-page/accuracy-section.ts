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

  get allEvaluations() {
    return this.args.evaluator.evaluations;
  }

  get evaluationsWithTrustedEvaluation() {
    return this.allEvaluations.filter((evaluation) => {
      return evaluation.trustedEvaluation;
    });
  }

  get falseNegativeEvaluations() {
    return this.allEvaluations.filter((evaluation) => {
      return evaluation.result === 'fail' && evaluation.trustedEvaluation?.result === 'pass';
    });
  }

  get falseNegativePercentage() {
    if (this.negativeEvaluationsWithTrustedEvaluation.length >= 10) {
      return parseFloat(((100 * this.falseNegativeEvaluations.length) / this.negativeEvaluationsWithTrustedEvaluation.length).toFixed(2));
    } else {
      return null;
    }
  }

  // TODO: Figure out a "generic" statistic type rather than piggybacking off CourseStageParticipationAnalysis?
  get falseNegativeRateStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      title: 'False Negative Rate',
      label: 'false negatives',
      value:
        this.falseNegativePercentage !== null
          ? `${this.falseNegativePercentage}%`
          : `${this.negativeEvaluationsWithTrustedEvaluation.length} datapoints (need 10)`,
      color:
        this.falseNegativePercentage !== null && this.falseNegativePercentage < 10
          ? 'green'
          : this.negativeEvaluationsWithTrustedEvaluation.length >= 10
            ? 'red'
            : 'gray',
      explanationMarkdown:
        'The percentage of "fail" evaluations that did not match human values. \n\nNeeds at least 10 trusted evaluations for comparison.',
    };
  }

  get falsePositiveEvaluations() {
    return this.allEvaluations.filter((evaluation) => {
      return evaluation.result === 'pass' && evaluation.trustedEvaluation?.result === 'fail';
    });
  }

  get falsePositivePercentage() {
    if (this.positiveEvaluationsWithTrustedEvaluation.length >= 10) {
      return parseFloat(((100 * this.falsePositiveEvaluations.length) / this.positiveEvaluationsWithTrustedEvaluation.length).toFixed(2));
    } else {
      return null;
    }
  }

  // TODO: Figure out a "generic" statistic type rather than piggybacking off CourseStageParticipationAnalysis?
  get falsePositiveRateStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      title: 'False Positive Rate',
      label: 'false positives',
      value:
        this.falsePositivePercentage !== null
          ? `${this.falsePositivePercentage}%`
          : `${this.positiveEvaluationsWithTrustedEvaluation.length} datapoints (need 10)`,
      color:
        this.falsePositivePercentage !== null && this.falsePositivePercentage < 10
          ? 'green'
          : this.positiveEvaluationsWithTrustedEvaluation.length >= 10
            ? 'red'
            : 'gray',
      explanationMarkdown:
        'The percentage of "pass" evaluations that did not match human values. \n\nNeeds at least 10 trusted evaluations for comparison.',
    };
  }

  get negativeEvaluationsWithTrustedEvaluation() {
    return this.allEvaluations.filter((evaluation) => {
      return evaluation.result === 'fail' && evaluation.trustedEvaluation;
    });
  }

  get positiveEvaluationsWithTrustedEvaluation() {
    return this.allEvaluations.filter((evaluation) => {
      return evaluation.result === 'pass' && evaluation.trustedEvaluation;
    });
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
