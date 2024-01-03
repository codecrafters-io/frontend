import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Store from '@ember-data/store';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import type VisibilityService from 'codecrafters-frontend/services/visibility';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class FakeDataToolbarComponent extends Component<Signature> {
  @service declare store: Store;
  @service declare visibilityService: VisibilityService;
  @service declare actionCableConsumerService: ActionCableConsumerService;

  @action
  doPoll() {
    const poller = new RepositoryPoller({
      store: this.store,
      visibilityService: this.visibilityService,
      actionCableConsumerService: this.actionCableConsumerService,
    });

    poller.isActive = true;
    poller.model = this.args.repository;
    poller.forcePoll();
  }

  @action
  async handleCreateSubmissionButtonClick() {
    const stage = this.args.repository.currentStage || this.args.repository.course.firstStage;

    // @ts-expect-error
    const submission = window.server.create('submission', {
      createdAt: new Date(),
      // @ts-expect-error
      repository: window.server.schema.repositories.find(this.args.repository.id),
      // @ts-expect-error
      courseStage: window.server.schema.courseStages.find(stage.id),
      status: 'evaluating',
    });

    submission.repository.update('lastSubmission', submission);
    this.doPoll();
  }

  @action
  async handleFailTestsButtonClick() {
    // @ts-expect-error
    const submission = window.server.schema.submissions.find(this.args.repository.lastSubmission.id);

    // @ts-expect-error
    const leaderboardEntry = window.server.schema.courseLeaderboardEntries.findBy({
      userId: submission.repository.user.id,
      languageId: submission.repository.language.id,
    });

    submission.update({ status: 'failure' });
    leaderboardEntry.update({ status: 'idle' });
    this.doPoll();
  }

  @action
  async handlePassTestsButtonClick() {
    const submission = this.args.repository.lastSubmission;

    // @ts-expect-error
    window.server.schema.submissions.find(submission.id).update({ status: 'success' });

    // @ts-expect-error
    window.server.create('course-stage-completion', {
      completedAt: new Date(),
      // @ts-expect-error
      repository: window.server.schema.repositories.find(this.args.repository.id),
      // @ts-expect-error
      courseStage: window.server.schema.courseStages.find(submission.courseStage.id),
    });

    this.doPoll();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FakeDataToolbar: typeof FakeDataToolbarComponent;
  }
}
