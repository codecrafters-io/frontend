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

export type ChallengeInterviewStage = {
  extensionName: string | null;
  name: string;
  slug: string;
};

export type ChallengeInterviewReportQuestion = {
  anchor: ChallengeInterviewCodeAnchor | null;
  evidence_quote: string | null;
  question: string;
  stage?: ChallengeInterviewStage;
  strong_answer_points: string[];
  verdict: ChallengeInterviewQuestionVerdict;
  verdict_explanation: string;
};

export type ChallengeInterviewClosingAnswer = {
  question: string;
  quote: string;
  summary: string;
};

export type ChallengeInterviewPlan = {
  closing_questions?: string[];
  questions: { anchor: ChallengeInterviewCodeAnchor; id: string; question: string; stage?: ChallengeInterviewStage }[];
};

export type ChallengeInterviewReport = {
  closing_answers?: ChallengeInterviewClosingAnswer[];
  overall_verdict: 'strong' | 'mixed' | 'needs_review';
  planned_question_count?: number; // missing from reports scored before it was added
  questions: ChallengeInterviewReportQuestion[];
  review_suggestions: string[];
  summary: string;
};

export type ChallengeInterviewStatus = 'generating' | 'ready' | 'scoring' | 'scored' | 'failed';

export type ChallengeInterviewEndReason = 'agent_ended' | 'user_ended' | 'time_limit' | 'connection_error';

export type ChallengeInterviewFormat = 'practice' | 'competition';

export default class ChallengeInterviewModel extends Model {
  @belongsTo('repository', { async: false, inverse: null }) declare repository: RepositoryModel;

  @attr() declare agentVariables: Record<string, string> | null; // free-form JSON
  @attr() declare codeFiles: ChallengeInterviewCodeFile[] | null; // free-form JSON
  @attr('string') declare competitionSlug: string | null;
  @attr('string') declare conversationToken: string | null;
  @attr('date') declare createdAt: Date;
  @attr('string') declare errorMessage: string | null;
  @attr('string') declare format: ChallengeInterviewFormat;
  @attr('boolean') declare isSubmitted: boolean;
  @attr('number') declare maxDurationSeconds: number | null;
  @attr('string') declare milestoneSlug: string | null;
  @attr() declare report: ChallengeInterviewReport | null; // free-form JSON
  @attr('string') declare status: ChallengeInterviewStatus;

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get isGenerating(): boolean {
    return this.status === 'generating';
  }

  get isOpen(): boolean {
    return this.isGenerating || this.isReady;
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
