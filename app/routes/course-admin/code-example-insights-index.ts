import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunitySolutionsAnalysisModel from 'codecrafters-frontend/models/community-solutions-analysis';

export type ModelType = {
  analyses: CommunitySolutionsAnalysisModel[];
  course: CourseModel;
  languages: LanguageModel[];
  selectedLanguage: LanguageModel | null;
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

    return {
      course,
      languages,
      selectedLanguage,
      analyses,
    };
  }
}
