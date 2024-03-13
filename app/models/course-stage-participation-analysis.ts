import Model, { attr, belongsTo } from '@ember-data/model';
import type CourseStageModel from './course-stage';

export type CourseStageParticipationAnalysisStatistic = {
  unit: string;
  value: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
  explanationMarkdown: string;
};

const participationCountsStatisticExplanationMarkdown = `
The number of users who've attempted this stage at least once.

A number greater than 100 is recommended for reliable insights.
`.trim();

const completionRateStatisticExplanationMarkdown = `
The percentage of users who've completed this stage after attempting it.

Users who don't attempt the stage are excluded from this calculation.

A well-designed stage should have a completion rate of >95%.
`.trim();

export default class CourseStageParticipationAnalysisModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'participationAnalyses' }) declare stage: CourseStageModel;

  @attr('number') declare participationsCount: number;
  @attr('number') declare attemptToCompletionPercentage: number;

  static nullParticipationCountsStatistic: CourseStageParticipationAnalysisStatistic = {
    unit: 'data points',
    value: '-',
    color: 'gray',
    explanationMarkdown: participationCountsStatisticExplanationMarkdown,
  };

  static nullCompletionRateStatistic: CourseStageParticipationAnalysisStatistic = {
    unit: 'completion rate',
    value: '-',
    color: 'gray',
    explanationMarkdown: completionRateStatisticExplanationMarkdown,
  };

  get completionRateStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      unit: 'completion rate',
      value: `${Math.floor(this.attemptToCompletionPercentage)}%`,
      color: this.attemptToCompletionPercentage >= 95 ? 'green' : this.attemptToCompletionPercentage >= 0.85 ? 'yellow' : 'red',
      explanationMarkdown: completionRateStatisticExplanationMarkdown,
    };
  }

  get participationCountsStatistic(): CourseStageParticipationAnalysisStatistic {
    return {
      unit: 'data points',
      value: this.participationsCount >= 250 ? '250+' : this.participationsCount.toString(),
      color: this.participationsCount >= 100 ? 'green' : this.participationsCount >= 25 ? 'yellow' : 'red',
      explanationMarkdown: participationCountsStatisticExplanationMarkdown,
    };
  }
}
