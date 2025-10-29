import { Factory } from 'miragejs';
import groupByFieldReducer from 'codecrafters-frontend/utils/group-by-field-reducer';

export default Factory.extend({
  submittedAt: () => new Date(),

  afterCreate(communitySolution) {
    const communitySolutionCounts = {};

    for (let [languageSlug, solutions] of Object.entries(
      communitySolution.courseStage.communitySolutions.models.reduce(
        groupByFieldReducer((solution) => solution.language.slug),
        {},
      ),
    )) {
      communitySolutionCounts[languageSlug] = solutions.length;
    }

    communitySolution.courseStage.update('communitySolutionCounts', communitySolutionCounts);
  },
});
