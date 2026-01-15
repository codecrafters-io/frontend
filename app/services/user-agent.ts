import Service from '@ember/service';
import { cached } from '@glimmer/tracking';
import { UAParser, type IResult } from 'ua-parser-js';

export default class UserAgentService extends Service {
  get isWindows(): boolean {
    return this.operatingSystem?.toLowerCase().includes('windows') ?? false;
  }

  get operatingSystem(): string | undefined {
    return this.parsed.os.name;
  }

  @cached
  get parsed(): IResult {
    return UAParser(navigator.userAgent);
  }
}

declare module '@ember/service' {
  interface Registry {
    'user-agent': UserAgentService;
  }
}
