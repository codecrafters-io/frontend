import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import { capitalize } from '@ember/string';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class CodeExampleInsightsMetadata extends Component<Signature> {
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

  get formattedFlakinessCheckStatus() {
    if (this.args.solution.flakinessCheckStatus === 'pending') {
      return '🚧 Flakiness check pending';
    } else if (this.args.solution.flakinessCheckStatus === 'success') {
      return '✅ Flakiness check passed';
    } else if (this.args.solution.flakinessCheckStatus === 'failure') {
      return '❌ Flakiness check:failed';
    } else if (this.args.solution.flakinessCheckStatus === 'error') {
      return '⚠️ Flakiness check error';
    } else {
      return `⚠️ Unknown flakiness check status: ${this.args.solution.flakinessCheckStatus}`;
    }
  }

  get formattedScoreReason() {
    if (this.isScored && this.args.solution.scoreReason) {
      return '⭐' + ' ' + capitalize(this.args.solution.scoreReason);
    } else {
      return 'Not Scored';
    }
  }

  get formattedVerificationStatus() {
    const verification = this.verificationAgainstLatestTesterVersion;
    const latestTesterVersion = this.latestTesterVersion;

    if (verification?.status === 'success') {
      return `✅ Verified against ${latestTesterVersion?.tagName}`;
    } else {
      return `Not verified against ${latestTesterVersion?.tagName ?? 'unknown'}`;
    }
  }

  get formattedVoteCounts(): string | null {
    // @ts-expect-error Model mixin methods/properties are not recognized
    const upvotes = this.args.solution.upvotesCount as number;
    // @ts-expect-error Model mixin methods/properties are not recognized
    const downvotes = this.args.solution.downvotesCount as number;

    if (upvotes === 0 && downvotes === 0) {
      return null;
    }

    const upvoteText = upvotes === 1 ? '1 upvote' : `${upvotes} upvotes`;
    const downvoteText = downvotes === 1 ? '1 downvote' : `${downvotes} downvotes`;

    return `${upvoteText}, ${downvoteText}`;
  }

  get isScored() {
    return this.args.solution.score !== null && this.args.solution.score > 0;
  }

  get latestTesterVersion() {
    return this.args.solution.courseStage.course.testerVersions.find((v) => v.isLatest);
  }

  get markdownContent() {
    const lines = [];

    lines.push(`* ${this.formattedScoreReason}`);

    for (const evaluation of this.formattedEvaluationResults) {
      lines.push(`* ${evaluation}`);
    }

    lines.push(`* ${this.formattedFlakinessCheckStatus}`);
    lines.push(`* ${this.formattedVerificationStatus}`);
    lines.push(`* ± ${this.args.solution.changedLinesCount} lines changed`);
    lines.push(`* ⚡︎ ${this.args.solution.highlightedLinesCount} lines highlighted`);

    if (this.formattedVoteCounts) {
      lines.push(`* ${this.formattedVoteCounts}`);
    }

    return lines.join('\n');
  }

  get verificationAgainstLatestTesterVersion() {
    return this.args.solution.verifications.find((v) => v.courseTesterVersion === this.latestTesterVersion) ?? null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsights::MetadataContainer': typeof CodeExampleInsightsMetadata;
  }
}
