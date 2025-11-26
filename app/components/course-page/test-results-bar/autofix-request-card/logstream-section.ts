import Component from '@glimmer/component';
import Logstream from 'codecrafters-frontend/utils/logstream';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { next } from '@ember/runloop';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
  };
}

interface ToolCallStartEvent {
  event: 'tool_call_start';
  params: {
    tool_call_id: string;
    tool_name: string;
    tool_arguments: Record<string, unknown>;
  };
}

interface ToolCallEndEvent {
  event: 'tool_call_end';
  params: { tool_call_id: string };
}

type Event = ToolCallStartEvent | ToolCallEndEvent;

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

  get text(): string {
    switch (this.tool_name) {
      case 'read':
        if (this.status === 'in_progress') {
          return `Reading ${this.tool_arguments['path']!}`;
        } else {
          return `Read ${this.tool_arguments['path']!}`;
        }

      case 'edit':
        if (this.status === 'in_progress') {
          return `Editing ${this.tool_arguments['path']!}`;
        } else {
          return `Edited ${this.tool_arguments['path']!}`;
        }

      case 'write':
        if (this.status === 'in_progress') {
          return `Creating ${this.tool_arguments['path']!}`;
        } else {
          return `Created ${this.tool_arguments['path']!}`;
        }

      case 'delete':
        if (this.status === 'in_progress') {
          return `Deleting ${this.tool_arguments['path']!}`;
        } else {
          return `Deleted ${this.tool_arguments['path']!}`;
        }

      case 'list':
        if (this.status === 'in_progress') {
          return 'Listing files';
        } else {
          return 'Listed files';
        }

      case 'bash':
        if (this.status === 'in_progress') {
          return 'Running tests';
        } else {
          return 'Ran tests';
        }

      // This is a fake tool call that we insert for UI display purposes
      case 'analyze':
        if (this.status === 'in_progress') {
          return 'Analyzing codebase';
        } else {
          return 'Analyzed codebase';
        }

      default:
        return this.tool_name;
    }
  }

  isAnalysisAction(): boolean {
    return this.tool_name === 'analyze' || this.tool_name === 'read' || this.tool_name === 'list';
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

    for (const event of this.events) {
      if (event.event === 'tool_call_start') {
        result.push(new ToolCall(event.params.tool_call_id, event.params.tool_name, event.params.tool_arguments || {}));
      } else if (event.event === 'tool_call_end') {
        result.find((toolCall) => toolCall.tool_call_id === event.params.tool_call_id)!.status = 'completed';
      }
    }

    if (result.every((toolCall) => toolCall.isAnalysisAction())) {
      // Show an in-progress analysis action if all tool calls are analysis actions.
      result.push(new ToolCall('analysis-0', 'analyze', {}));
    } else {
      let lastAnalysisActionIndex = -1;

      for (let i = result.length - 1; i >= 0; i--) {
        if (result[i]!.isAnalysisAction()) {
          lastAnalysisActionIndex = i;
          break;
        }
      }

      const analysisToolCall = new ToolCall(`analysis-${lastAnalysisActionIndex + 1}`, 'analyze', {});
      analysisToolCall.status = 'completed';

      result.splice(lastAnalysisActionIndex + 1, 0, analysisToolCall);
    }

    return result;
  }

  @action
  handleDidInsertEventsContainer(eventsContainer: HTMLDivElement) {
    this.eventsContainer = eventsContainer;
  }

  // @ts-expect-error ember-animated not typed
  // eslint-disable-next-line require-yield
  *listTransition({ insertedSprites, keptSprites, removedSprites }) {
    for (const sprite of keptSprites) {
      move(sprite);
    }

    for (const sprite of insertedSprites) {
      fadeIn(sprite);
    }

    for (const sprite of removedSprites) {
      fadeOut(sprite);
    }
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
