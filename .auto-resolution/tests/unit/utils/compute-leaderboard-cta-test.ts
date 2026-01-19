import computeLeaderboardCTA from 'codecrafters-frontend/utils/compute-leaderboard-cta';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RepositoryStageListModel from 'codecrafters-frontend/models/repository-stage-list';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';
import { module, test } from 'qunit';

module('Unit | Utility | compute-leaderboard-cta', function () {
  function createLeaderboardEntry(score: number): LeaderboardEntryModel {
    return { score } as LeaderboardEntryModel;
  }

  function createRankCalculation(rank: number, nextRanksWithScores: { rank: number; score: number }[]): LeaderboardRankCalculationModel {
    return { rank, nextRanksWithScores } as LeaderboardRankCalculationModel;
  }

  function createCourseStage(difficulty: CourseStageModel['difficulty']): CourseStageModel {
    return { difficulty } as CourseStageModel;
  }

  function createStageListItem(stage: CourseStageModel, position: number, isCompleted: boolean = false): RepositoryStageListItemModel {
    return {
      stage,
      position,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    } as RepositoryStageListItemModel;
  }

  function createRepository(stageListItems: RepositoryStageListItemModel[]): RepositoryModel {
    const stageList = {
      items: stageListItems,
    } as RepositoryStageListModel;

    return { stageList } as RepositoryModel;
  }

  test('returns null when rank is 1', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(1, []);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation);

    assert.strictEqual(result, null);
  });

  test('returns null when no next stages and no achievable ranks', function (assert) {
    // Need 900 points, 5 easy stages = 75, 5 medium = 150, 5 hard = 250 - none enough
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 10, score: 1000 }]);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation);

    assert.strictEqual(result, null);
  });

  test('returns CTA for completing this stage when current stage is incomplete', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 110 }]);
    const currentStage = createCourseStage('easy'); // easy = 15 points
    const stageListItems = [createStageListItem(currentStage, 1)];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    assert.strictEqual(result, 'Complete this stage to hit #45');
  });

  test('returns CTA for completing next stage when current stage is complete', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 110 }]);
    const currentStage = createCourseStage('easy');
    const nextStage = createCourseStage('easy'); // easy = 15 points
    const stageListItems = [
      createStageListItem(currentStage, 1, true), // current stage is completed
      createStageListItem(nextStage, 2), // next stage is incomplete
    ];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    assert.strictEqual(result, 'Complete next stage to hit #45');
  });

  test('returns CTA for completing multiple stages when more than one stage needed', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 140 }]); // Need 40 points
    // easy (15) + medium (30) = 45 points, which is enough
    const currentStage = createCourseStage('easy');
    const nextStage = createCourseStage('medium');
    const stageListItems = [createStageListItem(currentStage, 1), createStageListItem(nextStage, 2)];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    assert.strictEqual(result, 'Complete 2 stages to hit #45');
  });

  test('limits context stages to 5', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 200 }]); // Need 100 points
    // 6 easy stages provided, but only first 5 are considered (5 * 15 = 75 points, not enough)
    const currentStage = createCourseStage('easy');
    const stageListItems = [
      createStageListItem(currentStage, 1),
      createStageListItem(createCourseStage('easy'), 2),
      createStageListItem(createCourseStage('easy'), 3),
      createStageListItem(createCourseStage('easy'), 4),
      createStageListItem(createCourseStage('easy'), 5),
      createStageListItem(createCourseStage('easy'), 6),
    ];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    // Falls back to difficulty-based: 5 easy = 75 (not enough), 4 medium = 120 (enough)
    assert.strictEqual(result, 'Complete 4 medium stages to hit #45');
  });

  test('falls back to easy stages when context stages are not enough', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 145 }]); // Need 45 points

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation);

    // 3 easy stages = 45 points
    assert.strictEqual(result, 'Complete 3 easy stages to hit #45');
  });

  test('falls back to medium stages when easy stages are not enough', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 180 }]); // Need 80 points

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation);

    // 5 easy stages = 75 points (not enough), 3 medium stages = 90 points (enough)
    assert.strictEqual(result, 'Complete 3 medium stages to hit #45');
  });

  test('falls back to hard stages when medium stages are not enough', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 250 }]); // Need 150 points

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation);

    // 5 easy stages = 75 points (not enough)
    // 5 medium stages = 150 points (exactly enough)
    assert.strictEqual(result, 'Complete 5 medium stages to hit #45');
  });

  test('uses hard stages when only they can achieve the rank', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 260 }]); // Need 160 points

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation);

    // 5 easy stages = 75 points (not enough)
    // 5 medium stages = 150 points (not enough)
    // 4 hard stages = 200 points (enough)
    assert.strictEqual(result, 'Complete 4 hard stages to hit #45');
  });

  test('skips ranks that are already below current score', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [
      { rank: 49, score: 90 }, // Below current score, should be skipped
      { rank: 45, score: 110 },
    ]);
    const currentStage = createCourseStage('easy');
    const stageListItems = [createStageListItem(currentStage, 1)];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    assert.strictEqual(result, 'Complete this stage to hit #45');
  });

  test('shows highest achievable rank when one stage (in context) jumps multiple ranks', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    // One easy stage (15 points) would give us 115 points, which beats all three ranks
    const rankCalculation = createRankCalculation(50, [
      { rank: 48, score: 105 },
      { rank: 45, score: 110 },
      { rank: 42, score: 115 },
    ]);
    const currentStage = createCourseStage('easy'); // 15 points -> 115 total
    const stageListItems = [createStageListItem(currentStage, 1)];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    // Should show the highest rank (#42) since we can achieve all three
    assert.strictEqual(result, 'Complete this stage to hit #42');
  });

  test('shows highest achievable rank when one stage (out of context) jumps multiple ranks', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    // One easy stage (15 points) would give us 115 points, which beats all three ranks
    const rankCalculation = createRankCalculation(50, [
      { rank: 48, score: 105 },
      { rank: 45, score: 110 },
      { rank: 42, score: 115 },
    ]);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation);

    // Should show the highest rank (#42) since 1 easy stage achieves all three
    assert.strictEqual(result, 'Complete 1 easy stage to hit #42');
  });

  test('ignores ranks below current user rank in nextRanksWithScores', function (assert) {
    // User is at rank 50, but nextRanksWithScores contains rank 55 (which is below/worse)
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [
      { rank: 55, score: 105 }, // Invalid: rank 55 is worse than current rank 50
      { rank: 45, score: 110 },
    ]);
    const currentStage = createCourseStage('easy');
    const stageListItems = [createStageListItem(currentStage, 1)];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    // Should ignore rank 55 and use rank 45
    assert.strictEqual(result, 'Complete this stage to hit #45');
  });

  test('ignores ranks equal to current user rank in nextRanksWithScores', function (assert) {
    // User is at rank 50, but nextRanksWithScores contains rank 50 (same rank)
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [
      { rank: 50, score: 105 }, // Invalid: rank 50 is same as current rank
      { rank: 45, score: 110 },
    ]);
    const currentStage = createCourseStage('easy');
    const stageListItems = [createStageListItem(currentStage, 1)];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    // Should ignore rank 50 and use rank 45
    assert.strictEqual(result, 'Complete this stage to hit #45');
  });

  test('returns null when all ranks in nextRanksWithScores are invalid', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [
      { rank: 55, score: 105 }, // Invalid
      { rank: 60, score: 110 }, // Invalid
    ]);
    const currentStage = createCourseStage('easy');
    const stageListItems = [createStageListItem(currentStage, 1)];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    assert.strictEqual(result, null);
  });

  test('skips completed stages when computing next stages in context', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 140 }]); // Need 40 points
    // Current stage (easy 15) + next stage is completed (skipped) + third stage (medium 30) = 45 points
    const currentStage = createCourseStage('easy');
    const completedStage = createCourseStage('easy');
    const nextStage = createCourseStage('medium');
    const stageListItems = [
      createStageListItem(currentStage, 1),
      createStageListItem(completedStage, 2, true), // This stage is completed
      createStageListItem(nextStage, 3),
    ];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository, currentStage);

    // Should skip the completed stage and use current (15) + next uncompleted (30) = 45 points
    assert.strictEqual(result, 'Complete 2 stages to hit #45');
  });

  test('returns fallback CTA when context is undefined', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 110 }]);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation);

    // Falls back to difficulty-based: 1 easy = 15 points (enough)
    assert.strictEqual(result, 'Complete 1 easy stage to hit #45');
  });

  test('returns fallback CTA when only currentCourseStage is provided', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 110 }]);
    const currentStage = createCourseStage('easy');

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, undefined, currentStage);

    // Falls back to difficulty-based: 1 easy = 15 points (enough)
    assert.strictEqual(result, 'Complete 1 easy stage to hit #45');
  });

  test('returns fallback CTA when only repository is provided', function (assert) {
    const leaderboardEntry = createLeaderboardEntry(100);
    const rankCalculation = createRankCalculation(50, [{ rank: 45, score: 110 }]);
    const stageListItems = [createStageListItem(createCourseStage('easy'), 1)];
    const repository = createRepository(stageListItems);

    const result = computeLeaderboardCTA(leaderboardEntry, rankCalculation, repository);

    // Falls back to difficulty-based: 1 easy = 15 points (enough)
    assert.strictEqual(result, 'Complete 1 easy stage to hit #45');
  });
});
