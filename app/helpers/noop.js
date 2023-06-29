import Helper from '@ember/component/helper';

export default class NoopHelper extends Helper {
  compute() {
    return () => {};
  }
}
