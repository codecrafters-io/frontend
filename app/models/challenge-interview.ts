import Model, { attr, belongsTo } from '@ember-data/model';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { memberAction } from 'ember-api-actions';

export type ChallengeInterviewCodeAnchor = {
  end_line: number;
  path: string;
  start_line: number;
};

export type ChallengeInterviewCodeFile = {
  contents: string;
  path: string;
};

export type ChallengeInterviewQuestionVerdict = 'demonstrated' | 'partial' | 'not_demonstrated';

export type ChallengeInterviewReportQuestion = {
  anchor: ChallengeInterviewCodeAnchor | null;
  evidence_quote: string | null;
  question: string;
  strong_answer_points: string[];
  verdict: ChallengeInterviewQuestionVerdict;
  verdict_explanation: string;
};

export type ChallengeInterviewReport = {
  overall_verdict: 'strong' | 'mixed' | 'needs_review';
  planned_question_count?: number; // missing from reports scored before it was added
  questions: ChallengeInterviewReportQuestion[];
  review_suggestions: string[];
  summary: string;
};

export type ChallengeInterviewStatus = 'generating' | 'ready' | 'scoring' | 'scored' | 'failed';

export type ChallengeInterviewEndReason = 'agent_ended' | 'user_ended' | 'time_limit' | 'connection_error';

export default class ChallengeInterviewModel extends Model {
  @belongsTo('repository', { async: false, inverse: null }) declare repository: RepositoryModel;

  @attr('string') declare brief: string | null;
  @attr() declare codeFiles: ChallengeInterviewCodeFile[] | null; // free-form JSON
  @attr('string') declare conversationToken: string | null;
  @attr('date') declare createdAt: Date;
  @attr('string') declare errorMessage: string | null;
  @attr('number') declare maxDurationSeconds: number | null;
  @attr('string') declare milestoneSlug: string;
  @attr() declare report: ChallengeInterviewReport | null; // free-form JSON
  @attr('string') declare status: ChallengeInterviewStatus;

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get isGenerating(): boolean {
    return this.status === 'generating';
  }

  get isReady(): boolean {
    return this.status === 'ready';
  }

  get isScored(): boolean {
    return this.status === 'scored' && !!this.report;
  }

  get isScoring(): boolean {
    return this.status === 'scoring';
  }

  declare markAsEnded: (this: Model, payload: { conversation_id: string | null; end_reason: ChallengeInterviewEndReason }) => Promise<unknown>;
}

ChallengeInterviewModel.prototype.markAsEnded = memberAction({
  path: 'ended',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
