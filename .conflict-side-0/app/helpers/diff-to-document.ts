import { helper } from '@ember/component/helper';
import parseDiffAsDocument from 'codecrafters-frontend/utils/parse-diff-as-document';

const diffToDocument = helper(function diffToDocument([diff = '']: [string | undefined]) {
  return parseDiffAsDocument(diff);
});

export default diffToDocument;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'diff-to-document': typeof diffToDocument;
  }
}
