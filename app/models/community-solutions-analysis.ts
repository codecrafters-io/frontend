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
  red: 0,
};

const upvotesCountThresholds = {
  green: 10,
  yellow: 5,
  red: 0,
};

const downvotesCountThresholds = {
  red: 10,
  yellow: 5,
  green: 0,
};

const medianChangedLinesThresholds = {
  green: 10,
  yellow: 20,
  red: 30,
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
  @belongsTo('course-stage', { async: false, inverse: 'communitySolutionsAnalysis' }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;

  @attr('number') declare solutionsCount: number;
  @attr('number') declare scoredSolutionUpvotesCount: number;
  @attr('number') declare scoredSolutionDownvotesCount: number;
  @attr() declare changedLinesCountDistribution: Record<string, number>;

  get downvotesCountStatistic(): CommunitySolutionsAnalysisStatistic {
    return {
      title: 'Downvotes on Scored Solutions',
      label: 'downvotes',
      value: this.scoredSolutionDownvotesCount !== undefined ? this.scoredSolutionDownvotesCount.toString() : null,
      color:
        this.scoredSolutionDownvotesCount !== undefined
          ? this.calculateColorUsingInverseThresholds(this.scoredSolutionDownvotesCount, downvotesCountThresholds)
          : 'gray',
      explanationMarkdown: downvotesCountExplanationMarkdown,
    };
  }

  get medianChangedLinesStatistic(): CommunitySolutionsAnalysisStatistic {
    return {
      title: 'Median Changed Lines',
      label: 'lines',
      value: this.p50 !== undefined ? this.p50.toString() : null,
      color: this.p50 !== undefined ? this.calculateColorUsingInverseThresholds(this.p50, medianChangedLinesThresholds) : 'gray',
      explanationMarkdown: medianChangedLinesExplanationMarkdown,
    };
  }

  get p25(): number {
    return this.changedLinesCountDistribution['p25'] || 0;
  }

  get p50(): number {
    // median changed lines
    return this.changedLinesCountDistribution['p50'] || 0;
  }

  get p75(): number {
    return this.changedLinesCountDistribution['p75'] || 0;
  }

  get p90(): number {
    return this.changedLinesCountDistribution['p90'] || 0;
  }

  get p95(): number {
    return this.changedLinesCountDistribution['p95'] || 0;
  }

  get solutionsCountStatistic(): CommunitySolutionsAnalysisStatistic {
    return {
      title: 'Solutions Count',
      label: 'solutions',
      value: this.solutionsCount !== undefined ? this.solutionsCount.toString() : null,
      color: this.solutionsCount !== undefined ? this.calculateColorUsingThresholds(this.solutionsCount, solutionsCountThresholds) : 'gray',
      explanationMarkdown: solutionsCountExplanationMarkdown,
    };
  }

  get upvotesCountStatistic(): CommunitySolutionsAnalysisStatistic {
    return {
      title: 'Upvotes on Scored Solutions',
      label: 'upvotes',
      value: this.scoredSolutionUpvotesCount !== undefined ? this.scoredSolutionUpvotesCount.toString() : null,
      color:
        this.scoredSolutionUpvotesCount !== undefined
          ? this.calculateColorUsingThresholds(this.scoredSolutionUpvotesCount, upvotesCountThresholds)
          : 'gray',
      explanationMarkdown: upvotesCountExplanationMarkdown,
    };
  }

  private calculateColorUsingInverseThresholds(
    value: number,
    thresholds: { green: number; yellow: number; red: number },
  ): 'green' | 'yellow' | 'red' | 'gray' {
    if (value <= thresholds.green) {
      return 'green';
    } else if (value <= thresholds.yellow) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  private calculateColorUsingThresholds(
    value: number,
    thresholds: { green: number; yellow: number; red: number },
  ): 'green' | 'yellow' | 'red' | 'gray' {
    if (value >= thresholds.green) {
      return 'green';
    } else if (value >= thresholds.yellow) {
      return 'yellow';
    } else {
      return 'red'; // TODO: gray
    }
  }
}
