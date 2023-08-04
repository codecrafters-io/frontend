import { helper } from '@ember/component/helper';

export function replaceDescription(params) {
  let description = params[0];
  return description.replace("Members community for Q&A", "Community features");
}

export default helper(replaceDescription);
