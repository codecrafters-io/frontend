import type { CompetitionQuizTranscriptTurn } from 'codecrafters-frontend/models/competition-quiz';

const LAST_CUE_SECONDS = 10;

function timestamp(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${seconds.toFixed(3).padStart(6, '0')}`;
}

export default function transcriptToWebvtt(turns: CompetitionQuizTranscriptTurn[]): string {
  const cues = turns.map((turn, index) => {
    const start = turn.timeInCallSec;
    const end = Math.max(turns[index + 1]?.timeInCallSec ?? start + LAST_CUE_SECONDS, start + 1);
    const speaker = turn.role === 'agent' ? 'Interviewer' : 'Participant';

    return `${timestamp(start)} --> ${timestamp(end)}\n${speaker}: ${turn.text}`;
  });

  return ['WEBVTT', ...cues].join('\n\n');
}
