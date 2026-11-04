import InterviewBaseRoute from 'codecrafters-frontend/utils/interview-base-route';
import InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type ChallengeInterviewModel from 'codecrafters-frontend/models/challenge-interview';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export type ModelType = {
  course: CourseModel;
  interview: ChallengeInterviewModel | null;
  milestone: InterviewMilestone;
  repository: RepositoryModel;
};

type Params = {
  course_slug: string;
  interview?: string | null;
  milestone_slug: string;
  repo?: string | null;
};

export default class CourseInterviewRoute extends InterviewBaseRoute {
  queryParams = {
    interview: {
      refreshModel: true,
    },
    repo: {
      refreshModel: true,
    },
  };

  async findInterview(interviewId: string | null | undefined): Promise<ChallengeInterviewModel | null> {
    if (!interviewId) {
      return null;
    }

    try {
      return await this.store.findRecord('challenge-interview', interviewId, { reload: true });
    } catch {
      return null;
    }
  }

  async model(params: Params): Promise<ModelType | undefined> {
    const [course, allRepositories] = await this.loadCourseAndRepositories(params.course_slug);

    if (!course) {
      this.router.replaceWith('not-found');

      return;
    }

    if (!this.authenticator.currentUser?.isStaff) {
      this.router.replaceWith('course', course.slug);

      return;
    }

    const repository = this.selectRepository(course, allRepositories, params.repo);
    const milestone = repository ? InterviewMilestone.fromSlug(repository, params.milestone_slug) : null;

    if (!repository || !milestone) {
      this.router.replaceWith('course', course.slug);

      return;
    }

    return {
      course,
      interview: await this.findInterview(params.interview),
      milestone,
      repository,
    };
  }
}
