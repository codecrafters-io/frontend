import JSONAPIAdapter from '@ember-data/adapter/json-api';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ViewableMixin from 'codecrafters-frontend/mixins/viewable'; // eslint-disable-line ember/no-mixins
import VotableMixin from 'codecrafters-frontend/mixins/votable'; // eslint-disable-line ember/no-mixins
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunitySolutionEvaluationModel from './community-solution-evaluation';
import type CommunitySolutionExportModel from './community-solution-export';
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
  @hasMany('community-solution-export', { async: false, inverse: 'communitySolution' }) declare exports: CommunitySolutionExportModel[];

  // @ts-expect-error empty '' not supported
  @attr('') changedFiles: { diff: string; filename: string }[]; // free-form JSON

  // @ts-expect-error empty '' not supported
  @attr('') highlightedFiles: { filename: string; contents: string; highlighted_ranges: { start_line: number; end_line: number }[] }[] | null; // free-form JSON

  @attr('number') declare addedLinesCount: number;
  @attr('number') declare approvedCommentsCount: number;
  @attr('string') declare explanationMarkdown: string;
  @attr('string') declare commitSha: string;
  @attr('string') declare flakinessCheckStatus: 'pending' | 'success' | 'failure' | 'error';
  @attr('string') declare githubRepositoryName: string;
  @attr('boolean') declare githubRepositoryIsPrivate: boolean;
  @attr('number') declare highlightedLinesCount: number;
  @attr('boolean') declare isPinned: boolean;
  @attr('number') declare ratingMean: number | null;
  @attr('number') declare removedLinesCount: number;
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

  get changedLinesCount() {
    return this.addedLinesCount + this.removedLinesCount;
  }

  get currentExport(): CommunitySolutionExportModel | null {
    const validExports = this.exports.filter((exportModel) => exportModel.communitySolution.commitSha === this.commitSha && !exportModel.isExpired);

    return validExports.find((exportModel) => exportModel.isProvisioned) || validExports.find((exportModel) => exportModel.isProvisioning) || null;
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

  get screencast() {
    return this.screencasts[0];
  }

  @action
  async createOrGetExport(): Promise<CommunitySolutionExportModel> {
    const exportRecord = this.store.createRecord('community-solution-export', {
      communitySolution: this,
    });

    await exportRecord.save();

    return exportRecord;
  }

  @action
  githubUrlForFile(filename: string) {
    return `https://github.com/${this.githubRepositoryName}/blob/${this.commitSha}/${filename}`;
  }

  @action
  async markExportAsAccessed(exportModel: CommunitySolutionExportModel): Promise<void> {
    // @ts-ignore
    const adapter: JSONAPIAdapter = this.store.adapterFor('application');

    await adapter.ajax(`${adapter.host}/api/v1/community-solution-exports/${exportModel.id}/mark-as-accessed`, 'POST');

    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    exportModel.set('expiresAt', twentyFourHoursFromNow);
    await exportModel.save();
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
