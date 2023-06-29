import Helper from '@ember/component/helper';

export default class LogFnHelper extends Helper {
  compute([logMessage]) {
    return () => {
      console.log(logMessage);
    };
  }
}
