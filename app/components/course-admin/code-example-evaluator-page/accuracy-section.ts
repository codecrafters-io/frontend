import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { Tab } from 'codecrafters-frontend/components/tabs';
// import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';
import type { CourseStageParticipationAnalysisStatistic } from 'codecrafters-frontend/models/course-stage-participation-analysis';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    evaluator: CommunitySolutionEvaluatorModel;
  };
}

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

  get failRateColor(): 'green' | 'yellow' | 'red' | 'gray' {
    if (this.failRatePercentage === null) {
      return 'gray';
    }

    if (this.failRatePercentage < 5) {
      return 'red';
    } else if (this.failRatePercentage < 10) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  get failRatePercentage() {
    if (this.args.evaluator.totalEvaluationsCount === 0) {
      return null;
    }

    return parseFloat(((100 * this.args.evaluator.failedEvaluationsCount) / this.args.evaluator.totalEvaluationsCount).toFixed(2));
  }

  get failRateStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      title: 'Fail Rate',
      label: 'fails',
      value: this.failRatePercentage !== null ? `${this.failRatePercentage}%` : 'No evaluations',
      color: this.failRateColor,
      explanationMarkdown: 'The percentage of evaluations that resulted in "fail".',
    };
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
      value: this.falseNegativePercentage !== null ? `${this.falseNegativePercentage}%` : null,
      color: this.falseNegativePercentage !== null && this.falseNegativePercentage < 10 ? 'green' : 'red',
      explanationMarkdown:
        this.falseNegativePercentage !== null
          ? `The percentage of "fail" evaluations that did not match human values.\n\nTotal datapoints: ${this.negativeEvaluationsWithTrustedEvaluation.length}`
          : `The percentage of "fail" evaluations that did not match human values.\n\nOnly ${this.negativeEvaluationsWithTrustedEvaluation.length}/10 datapoints available`,
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
      value: this.falsePositivePercentage !== null ? `${this.falsePositivePercentage}%` : null,
      color: this.falsePositivePercentage !== null && this.falsePositivePercentage < 10 ? 'green' : 'red',
      explanationMarkdown:
        this.falsePositivePercentage !== null
          ? `The percentage of "pass" evaluations that did not match human values.\n\nTotal datapoints: ${this.positiveEvaluationsWithTrustedEvaluation.length}`
          : `The percentage of "pass" evaluations that did not match human values.\n\nOnly ${this.positiveEvaluationsWithTrustedEvaluation.length}/10 datapoints available`,
    };
  }

  get negativeEvaluationsWithTrustedEvaluation() {
    return this.allEvaluations.filter((evaluation) => {
      return evaluation.result === 'fail' && evaluation.trustedEvaluation;
    });
  }

  get passRateColor(): 'green' | 'yellow' | 'red' | 'gray' {
    if (this.passRatePercentage === null) {
      return 'gray';
    }

    if (this.passRatePercentage < 90) {
      return 'green';
    } else if (this.passRatePercentage < 95) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  get passRatePercentage() {
    if (this.args.evaluator.totalEvaluationsCount === 0) {
      return null;
    }

    return parseFloat(((100 * this.args.evaluator.passedEvaluationsCount) / this.args.evaluator.totalEvaluationsCount).toFixed(2));
  }

  get passRateStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      title: 'Pass Rate',
      label: 'passes',
      value: this.passRatePercentage !== null ? `${this.passRatePercentage}%` : 'No evaluations',
      color: this.passRateColor,
      explanationMarkdown: 'The percentage of evaluations that resulted in "pass".',
    };
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
