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
  green: 100,
  yellow: 15,
};

const upvotesCountThresholds = {
  green: 5,
  yellow: 1,
};

const downvotesCountThresholds = {
  red: 3,
  yellow: 3,
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
  @belongsTo('course-stage', { async: false, inverse: 'communitySolutionsAnalyses' }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;

  @attr() declare changedLinesCountDistribution: Record<string, number>;
  @attr('number') declare scoredSolutionDownvotesCount: number;
  @attr('number') declare scoredSolutionUpvotesCount: number;
  @attr('number') declare solutionsCount: number;

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
      color: 'gray',
      explanationMarkdown: medianChangedLinesExplanationMarkdown,
    };
  }

  get p50(): number {
    return this.changedLinesCountDistribution?.['p50'] || 0;
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

  private calculateColorUsingInverseThresholds(value: number, thresholds: { red: number; yellow: number }): 'red' | 'yellow' | 'green' {
    if (value >= thresholds.red) {
      return 'red';
    } else if (value >= thresholds.yellow) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  private calculateColorUsingThresholds(value: number, thresholds: { green: number; yellow: number }): 'green' | 'yellow' | 'red' {
    if (value >= thresholds.green) {
      return 'green';
    } else if (value >= thresholds.yellow) {
      return 'yellow';
    } else {
      return 'red';
    }
  }
}
