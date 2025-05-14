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
    // Clear any previous language-specific analysis assignments to avoid stale data
    // Reset communitySolutionsAnalysis on all stages before loading new analyses
    // TODO : Is this required for cleaning up the stale data ?
    // course.stages.forEach(stage => {
    //   // use direct assignment to trigger the belongsTo setter on native class
    //   stage.set('communitySolutionsAnalysis', null);
    // });

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

    // stage-to-analysis relationships will be handled by Ember Data
    course.stages.sortBy('position').forEach(stage => {
      console.log(stage.communitySolutionsAnalyses, stage.communitySolutionsAnalyses.length, stage.slug, stage.communitySolutionsAnalyses.map(a => a.language.slug))
    })

    return {
      course,
      languages,
      selectedLanguage,
      analyses,
    };
  }
}
