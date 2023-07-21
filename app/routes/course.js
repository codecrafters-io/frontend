import { inject as service } from '@ember/service';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RSVP from 'rsvp';
import { buildStepList } from 'codecrafters-frontend/lib/course-page-step-list';

export default class CourseRoute extends BaseRoute {
  @service authenticator;
  @service coursePageState;
  @service router;
  @service store;

  queryParams = {
    repo: {
      refreshModel: true,
    },
    track: {
      refreshModel: true,
    },
  };

  async model(params, transition) {
    const [allCourses, allRepositories] = await this.loadResources();
    const course = allCourses.find((course) => course.slug === params.course_slug);

    const repositories = allRepositories.filter((repository) => {
      return !repository.isNew && repository.course.id === course.id && repository.user.id === this.authenticator.currentUser.id;
    });

    const activeRepository = this.findOrCreateRepository(course, params, transition, repositories);
    this.coursePageState.setStepList(buildStepList(activeRepository));

    return {
      course: allCourses.find((course) => course.slug === params.course_slug),
      activeRepository: activeRepository,
      repositories: repositories,
    };
  }

  redirect(model, transition) {
    if (transition.to.name === 'course.index') {
      const activeStep = this.coursePageState.stepList.activeStep;

      if (activeStep.type === 'SetupStep') {
        this.router.replaceWith('course.setup', model.course.slug);
      } else if (activeStep.type === 'CourseStageStep') {
        this.router.replaceWith('course.stage', model.course.slug, activeStep.courseStage.position);
      } else if (activeStep.type === 'CourseCompletedStep') {
        this.router.replaceWith('course.completed', model.course.slug);
      }
    }
  }

  findOrCreateRepository(course, params, transition, repositories) {
    if (transition.to.queryParams.repo && transition.to.queryParams.repo === 'new') {
      const existingNewRepository = this.store.peekAll('repository').find((repository) => repository.isNew);

      if (existingNewRepository) {
        existingNewRepository.course = course;
        existingNewRepository.user = this.authenticator.currentUser;

        return existingNewRepository;
      } else {
        return this.store.createRecord('repository', { course: course, user: this.authenticator.currentUser });
      }
    } else if (transition.to.queryParams.repo) {
      const selectedRepository = repositories.find((repository) => repository.id === transition.to.queryParams.repo);

      if (selectedRepository) {
        return selectedRepository;
      } else {
        this.router.replaceWith('course', course.slug, { queryParams: { repo: null } });
      }
    } else if (transition.to.queryParams.track) {
      const lastPushedRepositoryForTrack = repositories
        .filterBy('language.slug', transition.to.queryParams.track)
        .filterBy('firstSubmissionCreated')
        .sortBy('lastSubmissionAt').lastObject;

      if (lastPushedRepositoryForTrack) {
        return lastPushedRepositoryForTrack;
      } else {
        return this.store.createRecord('repository', { course: course, user: this.authenticator.currentUser });
      }
    } else {
      const lastPushedRepository = repositories.filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt').lastObject;

      if (lastPushedRepository) {
        return lastPushedRepository;
      } else {
        return this.store.createRecord('repository', { course: course, user: this.authenticator.currentUser });
      }
    }
  }

  async loadResources() {
    const includedCourseResources = [
      'stages.solutions.language',
      'stages.source-walkthrough',
      'language-configurations.language',
      'stages.screencasts',
      'stages.screencasts.language',
      'stages.screencasts.user',
    ];

    let coursesPromise = this.store.findAll('course', {
      include: includedCourseResources.join(','),
    });

    let repositoriesPromise = this.store.findAll('repository', {
      include: RepositoryPoller.defaultIncludedResources,
    });

    const [allCourses, allRepositories] = await RSVP.all([coursesPromise, repositoriesPromise, this.authenticator.authenticate()]);

    return [allCourses, allRepositories];
  }
}
