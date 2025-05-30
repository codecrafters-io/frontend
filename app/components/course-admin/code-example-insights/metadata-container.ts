import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import { capitalize } from '@ember/string';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class CodeExampleInsightsMetadataComponent extends Component<Signature> {
  get formattedEvaluationResults(): string[] {
    if (this.args.solution.evaluations.length === 0) {
      return [];
    } else {
      const results: string[] = [];

      for (const evaluation of this.args.solution.evaluations) {
        if (evaluation.result === 'pass') {
          results.push(`✅ Passed \`${evaluation.evaluator.slug}\` check`);
        } else if (evaluation.result === 'fail') {
          results.push(`❌ Failed \`${evaluation.evaluator.slug}\` check`);
        } else {
          results.push(`⚠️ ${evaluation.result}ed \`${evaluation.evaluator.slug}\` check`);
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

  get markdownContent() {
    const lines = [];

    lines.push(`* ${this.formattedScoreReason}`);

    for (const evaluation of this.formattedEvaluationResults) {
      lines.push(`* ${evaluation}`);
    }

    lines.push(`* ± ${this.args.solution.changedLinesCount} lines changed`);
    lines.push(`* ⚡︎ ${this.args.solution.highlightedLinesCount} lines highlighted`);

    return lines.join('\n');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsights::MetadataContainer': typeof CodeExampleInsightsMetadataComponent;
  }
}
