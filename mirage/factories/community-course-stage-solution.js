import { Factory } from 'miragejs';
import { groupBy } from 'codecrafters-frontend/lib/lodash-utils';

export default Factory.extend({
  afterCreate(communitySolution) {
    const communitySolutionCounts = {};

    for (let [languageSlug, solutions] of Object.entries(
      groupBy(communitySolution.courseStage.communitySolutions.models, (solution) => solution.language.slug)
    )) {
      communitySolutionCounts[languageSlug] = solutions.length;
    }

    communitySolution.courseStage.update('communitySolutionCounts', communitySolutionCounts);
  },
});
