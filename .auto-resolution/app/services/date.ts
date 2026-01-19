import Service from '@ember/service';

export default class DateService extends Service {
  now(): number {
    return Date.now();
  }
}

declare module '@ember/service' {
  interface Registry {
    date: DateService;
  }
}
