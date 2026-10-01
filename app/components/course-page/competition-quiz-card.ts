import Component from '@glimmer/component';
import type ChallengeInterviewModel from 'codecrafters-frontend/models/challenge-interview';
import type PartnerCompetitionModel from 'codecrafters-frontend/models/partner-competition';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class CompetitionQuizCard extends Component<Signature> {
  @service declare store: Store;

  @tracked attempts: ChallengeInterviewModel[] = [];
  @tracked competition: PartnerCompetitionModel | null = null;

  get hasOpenAttempt(): boolean {
    return this.attempts.some((attempt) => attempt.isOpen && attempt.repository?.id === this.args.repository.id);
  }

  get hasSubmitted(): boolean {
    return this.attempts.some((attempt) => attempt.isSubmitted);
  }

  // The interview service is a separate app, so a failed lookup just hides the card.
  loadCompetitionTask = task({ restartable: true }, async (): Promise<void> => {
    try {
      const competitions = await this.store.query('partner-competition', { course_slug: this.args.repository.course.slug });
      const competition = competitions.slice()[0] || null;

      if (competition) {
        this.attempts = (await this.store.query('challenge-interview', { competition_slug: competition.slug })).slice();
      }

      this.competition = competition;
    } catch {
      this.competition = null;
    }
  });

  @action
  handleDidInsert(): void {
    this.loadCompetitionTask.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CompetitionQuizCard': typeof CompetitionQuizCard;
  }
}
