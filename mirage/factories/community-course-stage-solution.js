import { Factory } from 'miragejs';
import groupByFieldReductor from 'codecrafters-frontend/utils/group-by-field-reductor';

export default Factory.extend({
  submittedAt: () => new Date(),

  afterCreate(communitySolution) {
    const communitySolutionCounts = {};

    for (let [languageSlug, solutions] of Object.entries(
      communitySolution.courseStage.communitySolutions.models.reduce(
        groupByFieldReductor((solution) => solution.language.slug),
        {},
      ),
    )) {
      communitySolutionCounts[languageSlug] = solutions.length;
    }

    communitySolution.courseStage.update('communitySolutionCounts', communitySolutionCounts);
  },
});
