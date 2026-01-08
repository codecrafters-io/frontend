import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunitySolutionsAnalysisModel from 'codecrafters-frontend/models/community-solutions-analysis';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export type ModelType = {
  analyses: CommunitySolutionsAnalysisModel[];
  course: CourseModel;
  languages: LanguageModel[];
  selectedLanguage: LanguageModel;
};

export default class CodeExampleInsightsIndexRoute extends BaseRoute {
  @service declare store: Store;

  queryParams = {
    language_slug: {
      refreshModel: true,
    },
  };

  async model(params: { language_slug?: string }): Promise<ModelType> {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course as CourseModel;
    const languages = course.betaOrLiveLanguages;
    // Default to the first language in the list
    let selectedLanguage: LanguageModel = languages.toSorted(fieldComparator('slug'))[0]!;

    if (params.language_slug) {
      const found = languages.find((l) => l.slug === params.language_slug);

      if (found) {
        selectedLanguage = found;
      }
    }

    let analyses: CommunitySolutionsAnalysisModel[] = [];

    analyses = (await this.store.query('community-solutions-analysis', {
      course_id: course.id,
      language_id: selectedLanguage.id,
      include: 'course-stage,language',
    })) as unknown as CommunitySolutionsAnalysisModel[];

    return {
      course,
      languages,
      selectedLanguage,
      analyses,
    };
  }
}
