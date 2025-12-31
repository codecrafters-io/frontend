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
import type { ModelType } from 'codecrafters-frontend/routes/course';
import type { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import type { StepStatus, StepType } from 'codecrafters-frontend/utils/course-page-step-list/step';
import { task } from 'ember-concurrency';
import window from 'ember-window-mock';

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

  @tracked configureGithubIntegrationModalIsOpen = false;
  @tracked sidebarIsExpandedOnDesktop = true;
  @tracked sidebarIsExpandedOnMobile = false;
  @tracked leaderboardIsExpanded = true;

  // Used for deciding when to fire confetti
  @tracked stepStatusPreviouslyWas: StepStatus | null = null;
  @tracked stepIdPreviouslyWas: string | null = null;
  @tracked stepTypePreviouslyWas: StepType | null = null;

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
    this.setupKeyboardShortcutListeners();

    if (this.action === 'github_app_installation_completed') {
      this.configureGithubIntegrationModalIsOpen = true;

      next(() => {
        this.router.transitionTo({ queryParams: { action: null } }); // reset param
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
  handleKeyDown(event: KeyboardEvent) {
    // Cmd+J is a browser shortcut in some environments. We only intercept it on the course page.
    if (!this.shouldHandleTestResultsBarShortcut(event)) {
      return;
    }

    event.preventDefault();
    this.coursePageState.testResultsBarIsExpanded = !this.coursePageState.testResultsBarIsExpanded;
  }

  @action
  async handlePoll() {
    // Nothing to do at the moment
  }

  @action
  async handleRouteChanged() {
    this.sidebarIsExpandedOnMobile = false;
  }

  @action
  async handleWillDestroyContainer() {
    this.teardownRouteChangeListeners();
    this.teardownKeyboardShortcutListeners();
  }

  pollRepositoryTask = task({ keepLatest: true }, async (): Promise<void> => {
    await new RepositoryPoller(this.model.activeRepository).doPoll();
  });

  @action
  resetController(_controller: unknown, isExiting: boolean, _transition: unknown) {
    if (isExiting) {
      this.repo = undefined;
      this.track = undefined;
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
  setupKeyboardShortcutListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  @action
  setupRouteChangeListeners() {
    this.router.on('routeDidChange', this.handleRouteChanged);
  }

  private shouldHandleTestResultsBarShortcut(event: KeyboardEvent): boolean {
    if (event.repeat) {
      return false;
    }

    // Ignore keystrokes while typing in form fields.
    const target = event.target;

    if (target instanceof HTMLElement) {
      const tagName = target.tagName.toLowerCase();
      const isEditable =
        target.isContentEditable ||
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target.getAttribute('role') === 'textbox';

      if (isEditable) {
        return false;
      }
    }

    // Only relevant for stage steps (that's when the "Show logs / Hide logs" affordance exists).
    if (this.coursePageState.currentStep?.type !== 'CourseStageStep') {
      return false;
    }

    // Cmd+J on macOS, Ctrl+J elsewhere.
    const modifierPressed = event.metaKey || event.ctrlKey;

    if (!modifierPressed || event.altKey) {
      return false;
    }

    return (event.key || '').toLowerCase() === 'j';
  }

  @action
  teardownKeyboardShortcutListeners() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  @action
  teardownRouteChangeListeners() {
    this.router.off('routeDidChange', this.handleRouteChanged);
  }
}
