import Model, { attr, belongsTo } from '@ember-data/model';
import type CourseStageModel from './course-stage';
import type LanguageModel from './language';

export type CommunitySolutionsAnalysisStatistic = {
  title: string;
  label: string;
  value: string | null;
  color: 'green' | 'yellow' | 'red' | 'gray';
  explanationMarkdown: string;
};

const solutionsCountThresholds = {
  green: 10,
  yellow: 5,
};

const upvotesCountThresholds = {
  green: 10,
  yellow: 5,
};

const downvotesCountThresholds = {
  red: 10,
  yellow: 5,
};

const medianChangedLinesThresholds = {
  green: 10,
  yellow: 20,
};

const solutionsCountExplanationMarkdown = `
The number of community solutions available for this stage and language.

A higher number indicates more examples for users to learn from.
`.trim();

const upvotesCountExplanationMarkdown = `
The number of upvotes on "scored" community solutions for this stage and language.

Solutions are "scored" when they are recommended by our system. Upvotes indicate that users found these solutions helpful.
`.trim();

const downvotesCountExplanationMarkdown = `
The number of downvotes on "scored" community solutions for this stage and language.

Solutions are "scored" when they are recommended by our system. Downvotes indicate that users did not find these solutions helpful.
`.trim();

const medianChangedLinesExplanationMarkdown = `
The median number of changed lines across all solutions for this stage and language.

A high number may indicate that the stage requires extensive changes, while a low number typically indicates a more focused challenge.
`.trim();

export default class CommunitySolutionsAnalysisModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: null }) declare stage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;

  @attr('number') declare solutionsCount: number;
  @attr('number') declare scoredSolutionUpvotesCount: number;
  @attr('number') declare scoredSolutionDownvotesCount: number;
  @attr('number') declare p50: number; // median changed lines
  @attr() declare changedLinesCountDistribution: Record<string, number>;
  @attr('number') declare p25: number;
  @attr('number') declare p75: number;
  @attr('number') declare p90: number;
  @attr('number') declare p95: number;

  get solutionsCountStatistic(): CommunitySolutionsAnalysisStatistic {
    return {
      title: 'Solutions Count',
      label: 'solutions',
      value: this.solutionsCount.toString(),
      color: this.calculateColorUsingThresholds(this.solutionsCount, solutionsCountThresholds),
      explanationMarkdown: solutionsCountExplanationMarkdown,
    };
  }

  get medianChangedLinesStatistic(): CommunitySolutionsAnalysisStatistic {
    return {
      title: 'Median Changed Lines',
      label: 'lines',
      value: this.p50.toString(),
      color: this.calculateColorUsingInverseThresholds(this.p50, medianChangedLinesThresholds),
      explanationMarkdown: medianChangedLinesExplanationMarkdown,
    };
  }

  get upvotesCountStatistic(): CommunitySolutionsAnalysisStatistic {
    return {
      title: 'Upvotes on Scored Solutions',
      label: 'upvotes',
      value: this.scoredSolutionUpvotesCount.toString(),
      color: this.calculateColorUsingThresholds(this.scoredSolutionUpvotesCount, upvotesCountThresholds),
      explanationMarkdown: upvotesCountExplanationMarkdown,
    };
  }

  get downvotesCountStatistic(): CommunitySolutionsAnalysisStatistic {
    return {
      title: 'Downvotes on Scored Solutions',
      label: 'downvotes',
      value: this.scoredSolutionDownvotesCount.toString(),
      color: this.calculateColorUsingInverseThresholds(this.scoredSolutionDownvotesCount, downvotesCountThresholds),
      explanationMarkdown: downvotesCountExplanationMarkdown,
    };
  }

  calculateColorUsingInverseThresholds(value: number, thresholds: { green?: number; yellow?: number; red?: number }): 'green' | 'yellow' | 'red' {
    if (thresholds.green !== undefined && value <= thresholds.green) return 'green';
    if (thresholds.yellow !== undefined && value <= thresholds.yellow) return 'yellow';
    if (thresholds.red !== undefined && value >= thresholds.red) return 'red';
    return 'yellow';
  }

  calculateColorUsingThresholds(value: number, thresholds: { green?: number; yellow?: number; red?: number }): 'green' | 'yellow' | 'red' {
    if (thresholds.green !== undefined && value >= thresholds.green) return 'green';
    if (thresholds.yellow !== undefined && value >= thresholds.yellow) return 'yellow';
    if (thresholds.red !== undefined && value >= thresholds.red) return 'red';
    return 'yellow';
  }
}