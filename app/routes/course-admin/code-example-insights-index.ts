import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunitySolutionsAnalysisModel from 'codecrafters-frontend/models/community-solutions-analysis';

export type ModelType = {
  course: CourseModel;
  languages: LanguageModel[];
  selectedLanguage: LanguageModel | null;
  analyses: CommunitySolutionsAnalysisModel[];
};

export default class CodeExampleInsightsIndexRoute extends BaseRoute {
  @service declare store: Store;

  queryParams = {
    language_slug: {
      refreshModel: true,
    },
  };

  async model(params: { language_slug?: string }): Promise<ModelType> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course as CourseModel;
    const languages = course.betaOrLiveLanguages;
    const selectedLanguage = params.language_slug ? languages.find((l) => l.slug === params.language_slug) || null : null;

    let analyses: CommunitySolutionsAnalysisModel[] = [];

    if (selectedLanguage) {
      analyses = (await this.store.query('community-solutions-analysis', {
        course_id: course.id,
        language_id: selectedLanguage.id,
        include: 'course-stage,language',
      })) as unknown as CommunitySolutionsAnalysisModel[];
    }

    console.log(
      'Raw analyses with relationships:',
      analyses.map((a) => ({
        id: a.id,
        hasStage: Boolean(a.belongsTo('courseStage').id()),
        stageId: a.belongsTo('courseStage').id(),
        stageLoaded: Boolean(a.belongsTo('courseStage').id()),
      })),
    );

    // Manually connect analyses to stages
    analyses.forEach((analysis) => {
      const stageId = analysis.belongsTo('courseStage').id();
      const stage = course.sortedBaseStages.find((s) => s.id === stageId);

      if (stage) {
        // Manually set the relationship on the stage
        stage.set('communitySolutionsAnalysis', analysis);
      }
    });

    // console.log(course, languages, selectedLanguage, analyses);
    // console.log(course.sortedBaseStages);
    console.log(analyses);

    for (const stage of course.sortedBaseStages) {
      console.log(`Stage ${stage.name} (${stage.id}):`);
      console.log('- Analysis:', stage?.communitySolutionsAnalysis);

      if (stage?.communitySolutionsAnalysis) {
        console.log('- changedLinesCountDistribution:', stage?.communitySolutionsAnalysis?.changedLinesCountDistribution);
        console.log('- solutionsCount:', stage?.communitySolutionsAnalysis?.solutionsCount);
        console.log('- upvotes:', stage?.communitySolutionsAnalysis?.scoredSolutionUpvotesCount);
        console.log('- downvotes:', stage?.communitySolutionsAnalysis?.scoredSolutionDownvotesCount);
      } else {
        console.log('- No analysis available for this stage');
      }
    }

    return {
      course,
      languages,
      selectedLanguage,
      analyses,
    };
  }
}
