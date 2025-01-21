import { Facet } from '@codemirror/state';
import { lineCommentsWidget } from 'codecrafters-frontend/utils/code-mirror-line-comments-widget';
import { lineCommentsGutter } from 'codecrafters-frontend/utils/code-mirror-line-comments-gutter';

export class LineData {
  commentsCount: number;
  lineNumber: number;

  constructor({ commentsCount, lineNumber }: { commentsCount: number; lineNumber: number }) {
    this.commentsCount = commentsCount;
    this.lineNumber = lineNumber;
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

export const lineDataFacet = Facet.define<LineDataCollection>();

export function lineComments(lineData: LineDataCollection) {
  return [lineDataFacet.of(lineData), lineCommentsWidget(), lineCommentsGutter()];
}
