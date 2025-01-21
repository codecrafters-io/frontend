import { Facet } from '@codemirror/state';
import { lineCommentsGutter } from 'codecrafters-frontend/utils/code-mirror-line-comments-gutter';
import { lineCommentsWidget } from 'codecrafters-frontend/utils/code-mirror-line-comments-widget';

export const lineDataFacet = Facet.define<LineDataCollection>();

export class LineData {
  lineNumber: number;
  commentsCount: number;

  constructor({ lineNumber, commentsCount }: { lineNumber: number; commentsCount: number }) {
    this.lineNumber = lineNumber;
    this.commentsCount = commentsCount;
  }
}

export class LineDataCollection {
  #lineData: LineData[];

  constructor(lineData: LineData[] = []) {
    this.#lineData = lineData;
  }

  dataForLine(lineNumber: number) {
    return this.#lineData.find((c) => c.lineNumber === lineNumber);
  }
}

export function lineComments(lineData: LineDataCollection) {
  return [lineDataFacet.of(lineData), lineCommentsWidget(), lineCommentsGutter()];
}
