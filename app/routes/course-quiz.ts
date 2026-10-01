import InterviewBaseRoute from 'codecrafters-frontend/utils/interview-base-route';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import type ChallengeInterviewModel from 'codecrafters-frontend/models/challenge-interview';
import type CourseModel from 'codecrafters-frontend/models/course';
import type PartnerCompetitionModel from 'codecrafters-frontend/models/partner-competition';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export type ModelType = {
  competition: PartnerCompetitionModel;
  course: CourseModel;
  interview: ChallengeInterviewModel | null;
  repository: RepositoryModel;
};

type Params = {
  competition_slug: string;
  course_slug: string;
  repo?: string | null;
};

export default class CourseQuizRoute extends InterviewBaseRoute {
  queryParams = {
    repo: {
      refreshModel: true,
    },
  };

  // The interview service is a separate app, so a failed lookup falls back to the challenge page.
  async findCompetition(courseSlug: string, competitionSlug: string): Promise<PartnerCompetitionModel | null> {
    try {
      const competitions = await this.store.query('partner-competition', { course_slug: courseSlug });

      return competitions.find((competition) => competition.slug === competitionSlug) || null;
    } catch {
      return null;
    }
  }

  async findCurrentAttempt(competition: PartnerCompetitionModel, repository: RepositoryModel): Promise<ChallengeInterviewModel | null> {
    try {
      const attempts = (await this.store.query('challenge-interview', { competition_slug: competition.slug })).slice();
      const newestFirst = attempts.sort(fieldComparator('createdAt')).reverse();

      return (
        newestFirst.find((attempt) => attempt.isSubmitted) ||
        newestFirst.find((attempt) => attempt.isOpen && attempt.repository?.id === repository.id) ||
        null
      );
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

    const repository = this.selectRepository(course, allRepositories, params.repo);
    const competition = repository ? await this.findCompetition(course.slug, params.competition_slug) : null;

    if (!repository || !competition) {
      this.router.replaceWith('course', course.slug);

      return;
    }

    return {
      competition,
      course,
      interview: await this.findCurrentAttempt(competition, repository),
      repository,
    };
  }
}
