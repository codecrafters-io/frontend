import DateService from 'codecrafters-frontend/services/date';

export default class FakeDateService extends DateService {
  private _now: number | null;

  constructor() {
    super();

    this._now = null;
  }

  now(): number {
    if (this._now) {
      return this._now;
    }

    return super.now();
  }

  setNow(date: Date | number = Date.now()) {
    this._now = date instanceof Date ? date.getTime() : date;

    return this._now;
  }

  reset(): void {
    this._now = null;
  }
}
