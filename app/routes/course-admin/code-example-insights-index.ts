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
    language: {
      refreshModel: true,
    },
  };

  async model(params: { language?: string }): Promise<ModelType> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course as CourseModel;
    const languages = await this.store.findAll('language');
    
    let selectedLanguage: LanguageModel | null = null;
    let analyses: CommunitySolutionsAnalysisModel[] = [];

    if (params.language) {
      selectedLanguage = languages.find((language) => language.slug === params.language) as LanguageModel;

      if (selectedLanguage) {
        analyses = await this.store.query('community-solutions-analysis', {
          course_id: course.id,
          language_id: selectedLanguage.id,
          include: 'stage,language',
        }) as unknown as CommunitySolutionsAnalysisModel[];
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
