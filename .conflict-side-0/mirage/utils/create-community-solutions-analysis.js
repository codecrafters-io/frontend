export default function createCommunitySolutionsAnalysis(server, courseStage, language) {
  return server.create('community-solutions-analysis', {
    courseStage,
    language,
    changedLinesCountDistribution: { p50: 10, p90: 20 },
    scoredSolutionDownvotesCount: 0,
    scoredSolutionUpvotesCount: 0,
    solutionsCount: 1,
  });
}
