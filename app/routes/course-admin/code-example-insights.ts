import BaseRoute from 'codecrafters-frontend/utils/base-route';
import CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import Store from '@ember-data/store';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import { service } from '@ember/service';

export type CodeExampleInsightsRouteModel = {
  courseStage: CourseStageModel;
  language: LanguageModel;
  solutions: CommunityCourseStageSolutionModel[];
};

export default class CodeExampleInsightsRoute extends BaseRoute {
  @service declare store: Store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }

  queryParams = {
    language_slug: {
      refreshModel: true,
    },
    sort_mode: {
      refreshModel: true,
    },
  };

  async model(params: { stage_slug: string; language_slug?: string; sort_mode?: string }): Promise<CodeExampleInsightsRouteModel> {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course as CourseModel;
    const courseStage = course.stages.find((item) => item.slug === params.stage_slug);

    if (!courseStage) {
      throw new Error(`Course stage with slug "${params.stage_slug}" not found`);
    }

    const languages = course.betaOrLiveLanguages;

    let selectedLanguage = params.language_slug ? languages.find((l) => l.slug === params.language_slug) : null;

    // Default to the first language in the list
    if (!selectedLanguage) {
      selectedLanguage = languages.toSorted(fieldComparator('slug'))[0]!;
    }

    // Needed for rendering verification statuses
    await this.store.query('course-tester-version', {
      course_id: course.id,
      include: ['course', 'activator'].join(','),
    });

    return {
      courseStage: courseStage,
      language: selectedLanguage,
      solutions: (await this.store.query('community-course-stage-solution', {
        course_stage_id: courseStage.id,
        language_id: selectedLanguage.id,
        include: CommunityCourseStageSolutionModel.defaultIncludedResources.join(','),
        order: params.sort_mode || 'newest',
        adapterOptions: {
          admin: true,
        },
      })) as unknown as CommunityCourseStageSolutionModel[],
    };
  }
}
