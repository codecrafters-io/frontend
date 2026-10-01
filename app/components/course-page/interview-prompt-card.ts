import Component from '@glimmer/component';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ChallengeInterviewModel from 'codecrafters-frontend/models/challenge-interview';
import type InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    milestone: InterviewMilestone;
  };
}

export default class InterviewPromptCard extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked interviews: ChallengeInterviewModel[] = [];

  get latestScoredInterview(): ChallengeInterviewModel | null {
    return (
      this.interviews
        .filter((interview) => interview.isScored)
        .sort(fieldComparator('createdAt'))
        .at(-1) || null
    );
  }

  get latestVerdictLabel(): string | null {
    const verdict = this.latestScoredInterview?.report?.overall_verdict;

    return verdict ? { mixed: 'Mixed understanding', needs_review: 'Needs review', strong: 'Strong understanding' }[verdict] : null;
  }

  get repositoryId(): string {
    return this.args.milestone.repository.id;
  }

  get shouldShow(): boolean {
    return !!this.authenticator.currentUser?.isStaff && this.args.milestone.isComplete;
  }

  // The interview service is a separate experimental app, so a failed lookup shouldn't hide the prompt.
  loadInterviewsTask = task({ restartable: true }, async (): Promise<void> => {
    try {
      const interviews = await this.store.query('challenge-interview', {
        milestone_slug: this.args.milestone.slug,
        repository_id: this.repositoryId,
      });

      this.interviews = interviews.slice();
    } catch {
      this.interviews = [];
    }
  });

  @action
  handleDidInsert(): void {
    if (this.shouldShow) {
      this.loadInterviewsTask.perform();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::InterviewPromptCard': typeof InterviewPromptCard;
  }
}
