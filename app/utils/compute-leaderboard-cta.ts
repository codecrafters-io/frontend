import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import * as Sentry from '@sentry/ember';

export default function computeLeaderboardCTA(
  leaderboardEntry: LeaderboardEntryModel,
  rankCalculation: LeaderboardRankCalculationModel,
  nextStagesInContext: CourseStageModel[],
): string | null {
  if (rankCalculation.rank === 1) {
    return null;
  }

  return (
    computeCTAUsingNextStagesInContext(leaderboardEntry, rankCalculation, nextStagesInContext) ||
    computeCTAUsingStagesWithDifficulty(leaderboardEntry, rankCalculation, 'easy') ||
    computeCTAUsingStagesWithDifficulty(leaderboardEntry, rankCalculation, 'medium') ||
    computeCTAUsingStagesWithDifficulty(leaderboardEntry, rankCalculation, 'hard')
  );
}

// Examples:
// - Complete this stage to hit #100
// - Complete 2 stages to hit #100
// - Complete 5 stages to hit #100
//
// We never return a string if it requires more than 5 such stages.
function computeCTAUsingNextStagesInContext(
  leaderboardEntry: LeaderboardEntryModel,
  rankCalculation: LeaderboardRankCalculationModel,
  nextStagesInContext: CourseStageModel[],
): string | null {
  if (nextStagesInContext.length === 0) {
    return null;
  }

  const validNextRanksWithScores = filterValidNextRanksWithScores(leaderboardEntry, rankCalculation);

  for (let i = 1; i <= 5; i++) {
    const scoreDelta = nextStagesInContext.slice(0, i).reduce((acc, stage) => acc + CourseStageModel.scoreForDifficulty(stage.difficulty), 0);
    const scoreAfterCompletingStages = leaderboardEntry.score + scoreDelta;
    const highestNextRank = findHighestNextRank(scoreAfterCompletingStages, validNextRanksWithScores);

    if (highestNextRank === null) {
      continue;
    }

    if (i === 1) {
      return `Complete this stage to hit #${highestNextRank}`;
    } else {
      return `Complete ${i} stages to hit #${highestNextRank}`;
    }
  }

  return null;
}

// Examples:
// - Complete 1 easy stage to hit #100
// - Complete 2 medium stages to hit #100
// - Complete 5 hard stages to hit #100
//
// We never return a string if it requires more than 5 such stages.
function computeCTAUsingStagesWithDifficulty(
  leaderboardEntry: LeaderboardEntryModel,
  rankCalculation: LeaderboardRankCalculationModel,
  difficulty: CourseStageModel['difficulty'],
): string | null {
  const scorePerStage = CourseStageModel.scoreForDifficulty(difficulty);
  const validNextRanksWithScores = filterValidNextRanksWithScores(leaderboardEntry, rankCalculation);

  for (let i = 1; i <= 5; i++) {
    const scoreAfterCompletingStages = leaderboardEntry.score + i * scorePerStage;
    const highestNextRank = findHighestNextRank(scoreAfterCompletingStages, validNextRanksWithScores);

    if (highestNextRank === null) {
      continue;
    }

    return `Complete ${i} ${difficulty} stages to hit #${highestNextRank}`;
  }

  return null;
}

/**
 * Filters out invalid ranks (rank >= current_rank / score < current_score) and reports them to Sentry.
 * Returns only valid entries in nextRanksWithScores.
 */
function filterValidNextRanksWithScores(
  leaderboardEntry: LeaderboardEntryModel,
  rankCalculation: LeaderboardRankCalculationModel,
): { rank: number; score: number }[] {
  const validNextRanksWithScores: { rank: number; score: number }[] = [];

  for (const nextRankWithScore of rankCalculation.nextRanksWithScores) {
    if (nextRankWithScore.rank >= rankCalculation.rank) {
      Sentry.captureMessage(`nextRanksWithScores contains invalid rank`, {
        extra: { invalidRank: nextRankWithScore.rank, rankCalculationId: rankCalculation.id, currentRank: rankCalculation.rank },
      });

      continue;
    }

    if (nextRankWithScore.score <= leaderboardEntry.score) {
      Sentry.captureMessage(`nextRanksWithScores contains invalid score`, {
        extra: { invalidScore: nextRankWithScore.score, rankCalculationId: rankCalculation.id, currentScore: leaderboardEntry.score },
      });

      continue;
    }

    validNextRanksWithScores.push(nextRankWithScore);
  }

  return validNextRanksWithScores;
}

/**
 * Finds the highest (lowest number) rank that can be achieved with the given score.
 */
function findHighestNextRank(score: number, nextRanksWithScores: { rank: number; score: number }[]): number | null {
  let highestNextRank: number | null = null;

  for (const nextRankWithScore of nextRanksWithScores) {
    if (nextRankWithScore.score <= score && (highestNextRank === null || nextRankWithScore.rank < highestNextRank)) {
      highestNextRank = nextRankWithScore.rank;
    }
  }

  return highestNextRank;
}
