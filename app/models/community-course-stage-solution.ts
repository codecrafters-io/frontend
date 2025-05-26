import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ViewableMixin from 'codecrafters-frontend/mixins/viewable'; // eslint-disable-line ember/no-mixins
import VotableMixin from 'codecrafters-frontend/mixins/votable'; // eslint-disable-line ember/no-mixins
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunitySolutionEvaluationModel from './community-solution-evaluation';
import type CourseStageCommentModel from './course-stage-comment';
import type CourseStageModel from './course-stage';
import type CourseStageScreencastModel from './course-stage-screencast';
import type LanguageModel from './language';
import type TrustedCommunitySolutionEvaluationModel from './trusted-community-solution-evaluation';
import type UserModel from './user';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';
import { type FileComparison, FileComparisonFromJSON } from 'codecrafters-frontend/utils/file-comparison';
import { capitalize } from '@ember/string';

interface EvaluationResult {
  result: '✅ Passed' | '❌ Failed';
  check: string;
}

export default class CommunityCourseStageSolutionModel extends Model.extend(ViewableMixin, VotableMixin) {
  static defaultIncludedResources = ['user', 'language', 'comments', 'comments.user', 'comments.target', 'course-stage'];

  @service declare authenticator: AuthenticatorService; // used by VotableMixin

  @belongsTo('course-stage', { async: false, inverse: 'communitySolutions' }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @hasMany('community-solution-evaluation', { async: false, inverse: 'communitySolution' }) declare evaluations: CommunitySolutionEvaluationModel[];

  @hasMany('trusted-community-solution-evaluation', { async: false, inverse: 'communitySolution' })
  declare trustedEvaluations: TrustedCommunitySolutionEvaluationModel[];

  @hasMany('community-course-stage-solution-comment', { async: false, inverse: 'target' }) declare comments: CourseStageCommentModel[];
  @hasMany('course-stage-screencast', { async: false, inverse: null }) declare screencasts: CourseStageScreencastModel[];

  // @ts-expect-error empty '' not supported
  @attr('') changedFiles: { diff: string; filename: string }[]; // free-form JSON

  // @ts-expect-error empty '' not supported
  @attr('') highlightedFiles: { filename: string; contents: string; highlighted_ranges: { start_line: number; end_line: number }[] }[] | null; // free-form JSON

  @attr('number') declare approvedCommentsCount: number;
  @attr('string') declare explanationMarkdown: string;
  @attr('string') declare commitSha: string;
  @attr('string') declare githubRepositoryName: string;
  @attr('boolean') declare githubRepositoryIsPrivate: boolean;
  @attr('boolean') declare isPinned: boolean;
  @attr('number') declare ratingMean: number | null;
  @attr('number') declare score: number | null;
  @attr('string') declare scoreReason: 'concise' | 'pinned' | null;
  @attr('date') declare submittedAt: Date;
  @attr('boolean') declare isRestrictedToTeam: boolean; // if true, only fellow team members can see this solution

  get changedFilesFromHighlightedFiles() {
    if (!this.highlightedFiles) {
      return [];
    }

    return this.highlightedFiles.map((highlightedFile) => {
      return {
        diff: highlightedFile.contents
          .split('\n')
          .map((line, index) => {
            if (highlightedFile.highlighted_ranges.some((range) => range.start_line <= index + 1 && range.end_line >= index + 1)) {
              return `+${line}`;
            } else {
              return ` ${line}`;
            }
          })
          .join('\n'),
        filename: highlightedFile.filename,
      };
    });
  }

  get formattedEvaluationResults(): EvaluationResult[] {
    if (this.evaluations.length === 0) {
      return [];
    } else {
      const results: EvaluationResult[] = [];

      for (const evaluation of this.evaluations) {
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
    if (this.isScored && this.scoreReason) {
      return '⭐' + ' ' + capitalize(this.scoreReason);
    } else {
      return 'Not Scored';
    }
  }

  // We don't render explanations at the moment
  get hasExplanation() {
    return !!this.explanationMarkdown;
  }

  get isPublishedToGithub() {
    return this.githubRepositoryName;
  }

  get isPublishedToPublicGithubRepository() {
    return this.isPublishedToGithub && !this.githubRepositoryIsPrivate;
  }

  get isScored() {
    return this.score !== null && this.score > 0;
  }

  get screencast() {
    return this.screencasts[0];
  }

  get totalChangedLinesInDiff() {
    let added = 0,
      removed = 0;

    for (const changedFile of this.changedFiles) {
      const diff = changedFile['diff'];
      const lines = diff.split('\n');
      added += lines.filter((line: string) => line.startsWith('+')).length;
      removed += lines.filter((line: string) => line.startsWith('-')).length;
    }

    return added + removed;
  }

  @action
  githubUrlForFile(filename: string) {
    return `https://github.com/${this.githubRepositoryName}/blob/${this.commitSha}/${filename}`;
  }

  declare fetchFileComparisons: (this: Model, payload: unknown) => Promise<FileComparison[]>;
  declare unvote: (this: Model, payload: unknown) => Promise<void>;
}

CommunityCourseStageSolutionModel.prototype.fetchFileComparisons = memberAction({
  path: 'file-comparisons',
  type: 'get',

  after(response) {
    return response.map((json: Record<string, unknown>) => FileComparisonFromJSON(json));
  },
});

// TODO: Move to "VotableMixin"?
CommunityCourseStageSolutionModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    // @ts-expect-error Model mixin methods/properties are not recognized
    for (const record of [...this.currentUserUpvotes]) {
      // @ts-expect-error Model mixin methods/properties are not recognized
      this.upvotesCount -= 1;
      record.unloadRecord();
    }

    // @ts-expect-error Model mixin methods/properties are not recognized
    for (const record of [...this.currentUserDownvotes]) {
      // @ts-expect-error Model mixin methods/properties are not recognized
      this.downvotesCount -= 1;
      record.unloadRecord();
    }
  },
});
