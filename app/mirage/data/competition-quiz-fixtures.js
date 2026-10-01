import { readyInterviewAttributes } from 'codecrafters-frontend/mirage/data/challenge-interview-fixtures';

const pingStage = { extensionName: null, name: 'Respond to PING', slug: 'rg2' };
const multiplePingsStage = { extensionName: null, name: 'Respond to multiple PINGs', slug: 'wy1' };

export const competitionQuizAttributes = {
  codeFiles: readyInterviewAttributes.codeFiles,
  competitionName: 'Redis Sprint',
  competitionSlug: 'redis-sprint',
  courseSlug: 'redis',
  createdAt: new Date('2026-10-10T10:00:00Z'),
  endReason: 'agent_ended',
  endedAt: new Date('2026-10-10T10:09:00Z'),
  errorMessage: null,
  participantId: 'u-ada',
  participantUsername: 'ada',
  plan: {
    closing_questions: ['How did you find the challenge? Any feedback for us?'],
    questions: [
      {
        anchor: { end_line: 12, path: 'app/main.py', start_line: 5 },
        follow_up: 'What makes the loop stop?',
        id: 'q1',
        kind: 'approach',
        question: 'How did you implement the PING command?',
        stage: pingStage,
      },
      {
        anchor: { end_line: 20, path: 'app/main.py', start_line: 15 },
        follow_up: 'Where does each client get handled?',
        id: 'q2',
        kind: 'approach',
        question: 'How does your server handle several PINGs on one connection?',
        stage: multiplePingsStage,
      },
    ],
  },
  repositoryId: 'r1',
  report: {
    closing_answers: [
      {
        question: 'How did you find the challenge? Any feedback for us?',
        quote: 'I loved it, persistence next please',
        summary: 'Enjoyed the challenge and wants a persistence extension.',
      },
    ],
    overall_verdict: 'strong',
    planned_question_count: 2,
    questions: [
      {
        anchor: { end_line: 12, path: 'app/main.py', start_line: 5 },
        evidence_quote: 'It loops on recv until the client disconnects, and answers every PING with PONG.',
        question: 'How did you implement the PING command?',
        stage: pingStage,
        strong_answer_points: ['recv loop keeps the connection open'],
        verdict: 'demonstrated',
        verdict_explanation: 'They described the recv loop in handle_client and why it stops.',
      },
    ],
    review_suggestions: ['The second question went unasked; compare their stage 3 submission with the loop they described.'],
    summary: 'They explained the PING stage in their own words. The quiz ended before the second question.',
  },
  reviewDecision: null,
  reviewNote: null,
  reviewedAt: null,
  reviewedBy: null,
  status: 'scored',
  transcript: [
    { role: 'agent', text: 'How did you implement the PING command?', timeInCallSec: 3 },
    { role: 'user', text: 'It loops on recv until the client disconnects, and answers every PING with PONG.', timeInCallSec: 9 },
    { role: 'agent', text: 'How did you find the challenge? Any feedback for us?', timeInCallSec: 60 },
    { role: 'user', text: 'I loved it, persistence next please.', timeInCallSec: 66 },
  ],
};
