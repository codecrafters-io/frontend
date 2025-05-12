import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type { ModelType } from 'codecrafters-frontend/routes/course-admin/code-example-insights-index';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunitySolutionsAnalysisModel from 'codecrafters-frontend/models/community-solutions-analysis';

type StageWithAnalysis = {
  stage: CourseStageModel;
  analysis: CommunitySolutionsAnalysisModel;
};

export default class CodeExampleInsightsIndexController extends Controller {
  @service declare router: RouterService;

  queryParams = ['language'];
  language: string | null = null;

  declare model: ModelType;

  get stagesWithAnalyses(): StageWithAnalysis[] {
    const stagesWithAnalyses: StageWithAnalysis[] = [];

    if (!this.model.selectedLanguage) {
      return [];
    }

    // For each stage in the course, find the corresponding analysis if it exists
    this.model.course.stages.forEach((stage) => {
      const analysis = this.model.analyses.find((analysis) => analysis.stage.id === stage.id);

      if (analysis) {
        stagesWithAnalyses.push({
          stage,
          analysis,
        });
      }
    });

    return stagesWithAnalyses;
  }

  @action
  onLanguageChange(language: LanguageModel | null) {
    if (language) {
      this.router.transitionTo({
        queryParams: { language_slug: language.slug },
      });
    } else {
      this.router.transitionTo({
        queryParams: {},
      });
    }
  }

  getCourseStageCodeExamplesUrl(course: CourseModel, stage: CourseStageModel): string {
    return `/courses/${course.slug}/stages/${stage.slug}/code-examples`;
  }
}
