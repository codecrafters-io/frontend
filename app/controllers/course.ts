import { action } from '@ember/object';
import { service } from '@ember/service';
import { next } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import type ConfettiService from 'codecrafters-frontend/services/confetti';
import Controller from '@ember/controller';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type { ModelType } from 'codecrafters-frontend/routes/course';
import type { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import type { StepStatus, StepType } from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import * as Sentry from '@sentry/ember';
import { task } from 'ember-concurrency';

export default class CourseController extends Controller {
  declare model: ModelType;

  queryParams = ['action', 'track', 'repo'];

  @service declare authenticator: AuthenticatorService;
  @service declare confetti: ConfettiService;
  @service declare coursePageState: CoursePageStateService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  // query params
  @tracked action: string | undefined = undefined;
  @tracked repo: string | undefined = undefined;
  @tracked track: string | undefined = undefined;

  /** When set, used instead of model.activeRepository (avoids model refresh on QP change). */
  @tracked activeRepositoryOverride: RepositoryModel | null = null;

  @tracked configureGithubIntegrationModalIsOpen = false;
  @tracked sidebarIsExpandedOnDesktop = true;
  @tracked sidebarIsExpandedOnMobile = false;
  @tracked leaderboardIsExpanded = true;

  // Used for deciding when to fire confetti
  @tracked stepStatusPreviouslyWas: StepStatus | null = null;
  @tracked stepIdPreviouslyWas: string | null = null;
  @tracked stepTypePreviouslyWas: StepType | null = null;

  @tracked repositoryCreationErrorMessage: string | undefined;

  get activeRepository(): RepositoryModel {
    return this.activeRepositoryOverride ?? this.model.activeRepository;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get selectedRepositoryId() {
    return this.repo;
  }

  @action
  handleCollapseLeaderboardButtonClick() {
    this.leaderboardIsExpanded = !this.leaderboardIsExpanded;

    this.analyticsEventTracker.track('collapsed_course_page_leaderboard', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleCollapseSidebarButtonClick() {
    this.sidebarIsExpandedOnDesktop = false;
    this.sidebarIsExpandedOnMobile = false;

    this.analyticsEventTracker.track('collapsed_course_page_sidebar', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleDidInsertContainer() {
    this.setupRouteChangeListeners();

    if (this.action === 'github_app_installation_completed') {
      this.configureGithubIntegrationModalIsOpen = true;

      next(() => {
        this.action = undefined;
      });
    }
  }

  @action
  handleExpandLeaderboardButtonClick() {
    this.leaderboardIsExpanded = !this.leaderboardIsExpanded;

    this.analyticsEventTracker.track('expanded_course_page_leaderboard', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleExpandSidebarButtonClick() {
    this.sidebarIsExpandedOnDesktop = !this.sidebarIsExpandedOnDesktop;

    this.analyticsEventTracker.track('expanded_course_page_sidebar', {
      course_id: this.model.course.id,
    });
  }

  @action
  async handleLanguageSelection(language: LanguageModel): Promise<boolean> {
    this.repositoryCreationErrorMessage = undefined;
    this.activeRepository.language = language;

    try {
      await this.activeRepository.save();
    } catch (error) {
      this.activeRepository.language = undefined;
      this.repositoryCreationErrorMessage =
        'Failed to create repository, please try again? Contact us at hello@codecrafters.io if this error persists.';
      Sentry.captureException(error);

      return false;
    }

    this.repo = this.activeRepository.id;
    this.track = undefined;
    this.activeRepositoryOverride = null;

    return true;
  }

  @action
  async handlePoll() {
    // Nothing to do at the moment
  }

  @action
  handleRetryWithSameLanguage(dropdownActions: { close: () => void }) {
    const trackSlug = this.activeRepository.language?.slug ?? undefined;
    this.handleTryOtherLanguage(trackSlug ?? null);
    dropdownActions.close();
  }

  @action
  async handleRouteChanged() {
    this.sidebarIsExpandedOnMobile = false;
  }

  @action
  handleSelectRepository(repository: RepositoryModel, dropdownActions: { close: () => void }) {
    this.activeRepositoryOverride = repository;
    this.repo = repository.id;
    this.track = undefined;
    this.coursePageState.setStepList(new StepListDefinition(repository));
    dropdownActions.close();
  }

  @action
  handleToggleTestResultsBar() {
    this.coursePageState.testResultsBarIsExpanded = !this.coursePageState.testResultsBarIsExpanded;
  }

  @action
  handleTryOtherLanguage(track: string | null) {
    const course = this.model.course;
    const existingNew = this.store.peekAll('repository').find((repository) => repository.isNew);

    let newRepository: RepositoryModel;

    if (existingNew) {
      (existingNew as RepositoryModel).course = course;
      (existingNew as RepositoryModel).user = this.authenticator.currentUser!;
      newRepository = existingNew as RepositoryModel;
    } else {
      newRepository = this.store.createRecord('repository', {
        course,
        user: this.authenticator.currentUser,
      }) as RepositoryModel;
    }

    this.activeRepositoryOverride = newRepository;
    this.repo = 'new';
    this.track = track ?? undefined;
    this.coursePageState.setStepList(new StepListDefinition(newRepository));
  }

  @action
  async handleWillDestroyContainer() {
    this.teardownRouteChangeListeners();
  }

  pollRepositoryTask = task({ keepLatest: true }, async (): Promise<void> => {
    await new RepositoryPoller(this.activeRepository).doPoll();
  });

  @action
  resetController(_controller: unknown, isExiting: boolean, _transition: unknown) {
    if (isExiting) {
      this.repo = undefined;
      this.track = undefined;
      this.activeRepositoryOverride = null;
    }
  }

  @action
  setOrUpdateCurrentStepValues(_: HTMLDivElement, [step, _id, _status, _type]: [StepDefinition, string, string, string]) {
    const stepIsCompleteButNotPreviouslyComplete =
      step.status === 'complete' && this.stepStatusPreviouslyWas && this.stepStatusPreviouslyWas !== 'complete';

    const stepHasNotChanged = this.stepIdPreviouslyWas === step.id && this.stepTypePreviouslyWas === step.type;
    const stepIsCourseStageStep = step.type === 'CourseStageStep';

    // TODO: Investigate confetti for completed workflow step
    if (stepIsCourseStageStep && stepIsCompleteButNotPreviouslyComplete && stepHasNotChanged) {
      this.confetti.fireOnFocus({
        particleCount: 200,
        spread: 120,
      });
    }

    this.stepStatusPreviouslyWas = step.status;
    this.stepIdPreviouslyWas = step.id;
    this.stepTypePreviouslyWas = step.type;
  }

  @action
  setupRouteChangeListeners() {
    this.router.on('routeDidChange', this.handleRouteChanged);
  }

  @action
  teardownRouteChangeListeners() {
    this.router.off('routeDidChange', this.handleRouteChanged);
  }
}
