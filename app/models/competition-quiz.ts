import Model, { attr } from '@ember-data/model';
import type {
  ChallengeInterviewCodeFile,
  ChallengeInterviewPlan,
  ChallengeInterviewReport,
  ChallengeInterviewStatus,
} from 'codecrafters-frontend/models/challenge-interview';

export type CompetitionQuizReviewDecision = 'eligible' | 'not_eligible';

export type CompetitionQuizTranscriptTurn = {
  role: 'agent' | 'user';
  text: string;
  timeInCallSec: number;
};

const DECISION_LABELS: Record<CompetitionQuizReviewDecision, string> = {
  eligible: 'Eligible',
  not_eligible: 'Not eligible',
};

const AI_READ_LABELS: Record<ChallengeInterviewReport['overall_verdict'], string> = {
  mixed: 'Worth a listen',
  needs_review: 'Review closely',
  strong: 'Looks genuine',
};

export default class CompetitionQuizModel extends Model {
  @attr() declare codeFiles: ChallengeInterviewCodeFile[] | null; // free-form JSON
  @attr('string') declare competitionName: string;
  @attr('string') declare competitionSlug: string;
  @attr('string') declare courseSlug: string;
  @attr('date') declare createdAt: Date;
  @attr('string') declare endReason: string | null;
  @attr('date') declare endedAt: Date | null;
  @attr('string') declare errorMessage: string | null;
  @attr('string') declare participantId: string;
  @attr('string') declare participantUsername: string;
  @attr() declare plan: ChallengeInterviewPlan | null; // free-form JSON
  @attr() declare report: ChallengeInterviewReport | null; // free-form JSON
  @attr('string') declare repositoryId: string;
  @attr('string') declare reviewDecision: CompetitionQuizReviewDecision | null;
  @attr('string') declare reviewNote: string | null;
  @attr('date') declare reviewedAt: Date | null;
  @attr('string') declare reviewedBy: string | null;
  @attr('string') declare status: ChallengeInterviewStatus;
  @attr() declare transcript: CompetitionQuizTranscriptTurn[] | null; // free-form JSON

  get aiReadLabel(): string | null {
    return this.report ? AI_READ_LABELS[this.report.overall_verdict] : null;
  }

  get decisionLabel(): string {
    return this.reviewDecision ? DECISION_LABELS[this.reviewDecision] : 'Undecided';
  }

  get isScoringFailed(): boolean {
    return this.status === 'failed' && !this.report;
  }
}
