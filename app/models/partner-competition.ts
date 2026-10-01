import Model, { attr } from '@ember-data/model';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export default class PartnerCompetitionModel extends Model {
  @attr() declare courseSlugs: string[]; // free-form JSON
  @attr('date') declare endsAt: Date;
  @attr('string') declare name: string;
  @attr('string') declare partnerName: string;
  @attr('date') declare quizClosesAt: Date;
  @attr('date') declare startsAt: Date;

  get slug(): string {
    return this.id;
  }

  stagesCompletedDuringCompetition(repository: RepositoryModel): CourseStageModel[] {
    const stages = repository.courseStageCompletions
      .filter((completion) => completion.completedAt >= this.startsAt && completion.completedAt <= this.endsAt)
      .map((completion) => completion.courseStage);

    return [...new Set(stages)].sort((a, b) => a.position - b.position);
  }
}
