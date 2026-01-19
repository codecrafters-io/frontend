import Service, { service } from '@ember/service';
import { cached } from '@glimmer/tracking';
import { UAParser, type IResult } from 'ua-parser-js';
import type FastBootService from 'ember-cli-fastboot/services/fastboot';

export default class UserAgentService extends Service {
  @service declare fastboot: FastBootService;

  get isWindows(): boolean {
    return this.operatingSystem?.toLowerCase().includes('windows') ?? false;
  }

  get operatingSystem(): string | undefined {
    return this.parsed?.os.name;
  }

  @cached
  get parsed(): IResult | null {
    if (this.fastboot.isFastBoot) {
      return null;
    }

    return UAParser(navigator.userAgent);
  }
}

declare module '@ember/service' {
  interface Registry {
    'user-agent': UserAgentService;
  }
}
