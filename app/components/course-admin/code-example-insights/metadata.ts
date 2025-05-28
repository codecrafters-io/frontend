import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import { capitalize } from '@ember/string';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
  };
}

interface EvaluationResult {
  result: '✅ Passed' | '❌ Failed';
  check: string;
}

export default class CodeExampleInsightsMetadataComponent extends Component<Signature> {
  get changedLinesCount() {
    let added = 0,
      removed = 0;

    for (const changedFile of this.args.solution.changedFiles) {
      const diff = changedFile['diff'];
      const lines = diff.split('\n');
      added += lines.filter((line: string) => line.startsWith('+')).length;
      removed += lines.filter((line: string) => line.startsWith('-')).length;
    }

    return added + removed;
  }

  get formattedEvaluationResults(): EvaluationResult[] {
    if (this.args.solution.evaluations.length === 0) {
      return [];
    } else {
      const results: EvaluationResult[] = [];

      for (const evaluation of this.args.solution.evaluations) {
        if (evaluation.result === 'pass') {
          results.push({
            result: '✅ Passed',
            check: evaluation.evaluator.slug,
          });
        } else if (evaluation.result === 'fail') {
          results.push({
            result: '❌ Failed',
            check: evaluation.evaluator.slug,
          });
        }
      }

      return results;
    }
  }

  get formattedScoreReason() {
    if (this.isScored && this.args.solution.scoreReason) {
      return '⭐' + ' ' + capitalize(this.args.solution.scoreReason);
    } else {
      return 'Not Scored';
    }
  }

  get isScored() {
    return this.args.solution.score !== null && this.args.solution.score > 0;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsights::Metadata': typeof CodeExampleInsightsMetadataComponent;
  }
}
