import Component from '@glimmer/component';
import Logstream from 'codecrafters-frontend/utils/logstream';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
  };
}

interface Event {
  event: 'tool_call_start' | 'tool_call_end';
  params: {
    tool_call_id: string;
    tool_name: string;
    tool_arguments: Record<string, unknown>;
  };
}

class ToolCall {
  tool_call_id: string;
  tool_name: string;
  tool_arguments: Record<string, unknown>;
  status: 'in_progress' | 'completed';

  constructor(tool_call_id: string, tool_name: string, tool_arguments: Record<string, unknown>) {
    this.tool_call_id = tool_call_id;
    this.tool_name = tool_name;
    this.tool_arguments = tool_arguments;
    this.status = 'in_progress';
  }

  get textComponents(): [string, string] {
    switch (this.tool_name) {
      case 'read':
        if (this.status === 'in_progress') {
          return ['Reading', 'abcd.rb'];
        } else {
          return ['Read', 'abcd.rb'];
        }

      case 'edit':
        if (this.status === 'in_progress') {
          return ['Editing', 'abcd.rb'];
        } else {
          return ['Edited', 'abcd.rb'];
        }

      case 'delete':
        if (this.status === 'in_progress') {
          return ['Deleting', 'abcd.rb'];
        } else {
          return ['Deleted', 'abcd.rb'];
        }

      case 'list':
        if (this.status === 'in_progress') {
          return ['Listing', ''];
        } else {
          return ['Listed', ''];
        }

      case 'bash':
        if (this.status === 'in_progress') {
          return ['Running', 'tests'];
        } else {
          return ['Ran', 'tests'];
        }

      // This is a fake tool call that we insert for UI display purposes
      case 'analyze':
        if (this.status === 'in_progress') {
          return ['Analyzing', 'codebase'];
        } else {
          return ['Analyzed', 'codebase'];
        }

      default:
        return [this.tool_name, ''];
    }
  }
}

export default class LogstreamSection extends Component<Signature> {
  transition = fade;

  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare store: Store;

  @tracked declare logstream: Logstream;
  @tracked logstreamContent = '';
  @tracked eventsContainer: HTMLDivElement | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.logstream = new Logstream(args.autofixRequest.logstreamId, this.actionCableConsumer, this.store, () => {
      this.logstreamContent = this.logstream.content || '';

      next(() => {
        if (this.eventsContainer) {
          this.eventsContainer.scrollTop = this.eventsContainer.scrollHeight;
        }
      });
    });

    next(() => {
      this.logstream.subscribe();
    });
  }

  get events(): Event[] {
    return this.logstream.content
      .split('\n')
      .map((line) => {
        try {
          return JSON.parse(line) as Event;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Event[];
  }

  get toolCalls(): ToolCall[] {
    const result: ToolCall[] = [];

    if (this.events.length === 0) {
      result.push(new ToolCall('fake-tool-call-id', 'analyze', {}));
    }

    for (const event of this.events) {
      if (event.event === 'tool_call_start') {
        result.push(new ToolCall(event.params.tool_call_id, event.params.tool_name, event.params.tool_arguments || {}));
      } else if (event.event === 'tool_call_end') {
        result.find((toolCall) => toolCall.tool_call_id === event.params.tool_call_id)!.status = 'completed';
      }
    }

    return result;
  }

  @action
  handleDidInsertEventsContainer(eventsContainer: HTMLDivElement) {
    this.eventsContainer = eventsContainer;
  }

  willDestroy() {
    super.willDestroy();

    if (this.logstream) {
      this.logstream.unsubscribe();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixRequestCard::LogstreamSection': typeof LogstreamSection;
  }
}
