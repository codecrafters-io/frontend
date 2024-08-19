import Model, { attr, belongsTo } from '@ember-data/model';
import type CourseStageModel from './course-stage';
import { pluralize } from 'ember-inflector';

export type CourseStageParticipationAnalysisStatistic = {
  title: string;
  label: string;
  value: string | null;
  color: 'green' | 'yellow' | 'red' | 'gray';
  explanationMarkdown: string;
};

const attemptRateThresholds = {
  green: 90,
  yellow: 80,
};

const completionRateThresholds = {
  green: 97,
  yellow: 90,
};

const participationCountsThresholds = {
  green: 100,
  yellow: 50,
};

const medianAttemptsToCompletionThresholds = {
  green: 3,
  yellow: 7,
};

const attemptRateStatisticExplanationMarkdown = `
The percentage of users who've attempted this stage at least once.

A well-designed stage should have an attempt rate of >${attemptRateThresholds.green}%.
`.trim();

const participationCountsStatisticExplanationMarkdown = `
The number of users who've attempted this stage at least once.

A number greater than ${participationCountsThresholds.green} is recommended for reliable insights.
`.trim();

const completionRateStatisticExplanationMarkdown = `
The percentage of users who've completed this stage after attempting it.

Users who don't attempt the stage are excluded from this calculation.

A well-designed stage should have a completion rate of >${completionRateThresholds.green}%.
`.trim();

const medianAttemptsToCompletionStatisticExplanationMarkdown = `
The median number of attempts users have made to complete this stage.

A high number (> ${medianAttemptsToCompletionThresholds.green}) suggests that the error messages or hints for this stage could be improved.
`.trim();

export default class CourseStageParticipationAnalysisModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'participationAnalyses' }) declare stage: CourseStageModel;

  @attr('number') declare activeParticipationsCount: number;
  @attr('number') declare completeParticipationsCount: number;
  @attr('number') declare droppedOffAfterAttemptParticipationsCount: number;
  @attr('number') declare droppedOffBeforeAttemptParticipationsCount: number;
  @attr('number') declare participationsCount: number;

  // These statistics might be null if there are no participations.
  @attr('number') declare attemptToCompletionPercentage: number | null;
  @attr('number') declare attemptPercentage: number | null;
  @attr('number') declare medianAttemptsToCompletion: number | null;

  get activeParticipationsPercentage(): number {
    return parseFloat((100 * (this.activeParticipationsCount / this.participationsCount)).toFixed(2));
  }

  get attemptRateStatistic(): CourseStageParticipationAnalysisStatistic {
    if (this.attemptPercentage === null) {
      return {
        title: 'Attempt Rate',
        label: 'attempt rate',
        value: null,
        color: 'gray',
        explanationMarkdown: attemptRateStatisticExplanationMarkdown,
      };
    } else {
      return {
        title: 'Attempt Rate',
        label: 'attempt rate',
        value: `${Math.floor(this.attemptPercentage)}%`,
        color: this.calculateColorUsingThresholds(this.attemptPercentage, attemptRateThresholds),
        explanationMarkdown: attemptRateStatisticExplanationMarkdown,
      };
    }
  }

  get completeParticipationsPercentage(): number {
    return parseFloat((100 * (this.completeParticipationsCount / this.participationsCount)).toFixed(2));
  }

  get completionRateStatistic(): CourseStageParticipationAnalysisStatistic {
    if (this.attemptToCompletionPercentage === null) {
      return {
        title: 'Attempt to Completion Rate',
        label: 'completion rate',
        value: null,
        color: 'gray',
        explanationMarkdown: completionRateStatisticExplanationMarkdown,
      };
    } else {
      return {
        title: 'Attempt to Completion Rate',
        label: 'completion rate',
        value: `${Math.floor(this.attemptToCompletionPercentage)}%`,
        color: this.calculateColorUsingThresholds(this.attemptToCompletionPercentage, completionRateThresholds),
        explanationMarkdown: completionRateStatisticExplanationMarkdown,
      };
    }
  }

  get droppedOffAfterAttemptParticipationsPercentage(): number {
    return parseFloat((100 * (this.droppedOffAfterAttemptParticipationsCount / this.participationsCount)).toFixed(2));
  }

  get droppedOffBeforeAttemptParticipationsPercentage(): number {
    return parseFloat((100 * (this.droppedOffBeforeAttemptParticipationsCount / this.participationsCount)).toFixed(2));
  }

  get medianAttemptsToCompletionStatistic(): CourseStageParticipationAnalysisStatistic {
    if (this.medianAttemptsToCompletion === null) {
      return {
        title: 'Median Attempts To Completion',
        label: 'attempts',
        value: null,
        color: 'gray',
        explanationMarkdown: medianAttemptsToCompletionStatisticExplanationMarkdown,
      };
    } else {
      return {
        title: 'Median Attempts To Completion',
        label: pluralize(this.medianAttemptsToCompletion, 'attempt', { withoutCount: true }),
        value: this.medianAttemptsToCompletion.toString(),
        color: this.calculateColorUsingInverseThresholds(this.medianAttemptsToCompletion, medianAttemptsToCompletionThresholds),
        explanationMarkdown: medianAttemptsToCompletionStatisticExplanationMarkdown,
      };
    }
  }

  get participationsCountStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      title: 'Data Points',
      label: 'data points',
      value: this.participationsCount >= 250 ? '250+' : this.participationsCount.toString(),
      color: this.calculateColorUsingThresholds(this.participationsCount, participationCountsThresholds),
      explanationMarkdown: participationCountsStatisticExplanationMarkdown,
    };
  }

  calculateColorUsingInverseThresholds(value: number, thresholds: { green: number; yellow: number }): 'green' | 'yellow' | 'red' {
    return value <= thresholds.green ? 'green' : value <= thresholds.yellow ? 'yellow' : 'red';
  }

  calculateColorUsingThresholds(value: number, thresholds: { green: number; yellow: number }): 'green' | 'yellow' | 'red' {
    return value >= thresholds.green ? 'green' : value >= thresholds.yellow ? 'yellow' : 'red';
  }
}
