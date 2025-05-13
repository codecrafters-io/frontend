import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type { ModelType } from 'codecrafters-frontend/routes/course-admin/code-example-insights-index';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CommunitySolutionsAnalysisModel from 'codecrafters-frontend/models/community-solutions-analysis';
import Store from '@ember-data/store';

type StageWithAnalysis = {
  stage: CourseStageModel;
  analysis: CommunitySolutionsAnalysisModel;
};

export default class CodeExampleInsightsIndexController extends Controller {
  @service declare router: RouterService;
  @service declare store: Store;

  queryParams = ['language'];
  language: string | null = null;

  declare model: ModelType;

  getEmptyAnalysis(stage: CourseStageModel, language: LanguageModel): CommunitySolutionsAnalysisModel {
    return this.store.createRecord('community-solutions-analysis', {
      solutionsCount: 0,
      scoredSolutionUpvotesCount: 0,
      scoredSolutionDownvotesCount: 0,
      courseStage: stage as CourseStageModel,
      language: language as LanguageModel,
      changedLinesCountDistribution: {
        p25: 0,
        p50: 0,
        p75: 0,
        p90: 0,
        p95: 0,
      },
    });
  }

  get stagesWithAnalyses(): StageWithAnalysis[] {
    const stagesWithAnalyses: StageWithAnalysis[] = [];

    if (!this.model.selectedLanguage) {
      return [];
    }

    // For each stage in the course, find the corresponding analysis if it exists
    this.model.course.stages.forEach((stage) => {
      // First check if the stage already has a communitySolutionsAnalysis
      let analysis = stage.communitySolutionsAnalysis;

      // If not, try to find an analysis with this stage as courseStage
      if (!analysis) {
        analysis = this.model.analyses.find((a) => {
          const stageId = a.belongsTo('courseStage').id();

          return stageId === stage.id;
        });
      }

      // If still not found, create an empty analysis
      if (!analysis) {
        analysis = this.getEmptyAnalysis(stage, this.model.selectedLanguage as LanguageModel);
      }

      stagesWithAnalyses.push({
        stage,
        analysis,
      });
    });

    console.log('stagesWithAnalyses', stagesWithAnalyses);

    return stagesWithAnalyses;
  }

  getCourseStageCodeExamplesUrl(course: CourseModel, stage: CourseStageModel): string {
    return `/courses/${course.slug}/stages/${stage.slug}/code-examples`;
  }

  findAnalysisByStageId(stageId: string) {
    return (stageWithAnalysis: StageWithAnalysis | null) => {
      if (!stageWithAnalysis) return false;

      return stageWithAnalysis.stage.id === stageId;
    };
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
}
