import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Logstream from 'codecrafters-frontend/utils/logstream';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
  };
};

export default class AutofixResultComponent extends Component<Signature> {
  @service declare store: Store;
  @service declare actionCableConsumer: ActionCableConsumerService;

  @tracked logstream: Logstream | null = null;
  @tracked shouldShowFullLog = false;
  @tracked diffIsBlurred = true;

  @action
  handleDidUpdateAutofixRequestLogstreamId() {
    if (this.logstream && this.args.autofixRequest.logstreamId !== this.logstream.logstreamId) {
      this.logstream.unsubscribe();
      this.handleMarkdownStreamElementInserted(); // create a new logstream
    }
  }

  @action
  handleLogstreamDidPoll(): void {
    this.args.autofixRequest.reload();
  }

  @action
  handleMarkdownStreamElementInserted() {
    this.logstream = new Logstream(this.args.autofixRequest.logstreamId, this.actionCableConsumer, this.store, this.handleLogstreamDidPoll);
    this.logstream.subscribe();
  }

  @action
  handleWillDestroyMarkdownStreamElement() {
    if (this.logstream) {
      this.logstream.unsubscribe();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixSection::AutofixResult': typeof AutofixResultComponent;
  }
}
