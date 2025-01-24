import { Compartment, Facet, StateEffect } from '@codemirror/state';
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

export const expandedLineNumbersFacet = Facet.define<number[]>();

export const expandedLineNumbersCompartment = new Compartment();

export const toggleLineCommentsEffect = StateEffect.define<{ pos: number; isExpanded: boolean }>({
  map: (value, mapping) => ({ pos: mapping.mapPos(value.pos), isExpanded: value.isExpanded }),
});

export function lineComments(lineData: LineDataCollection) {
  return [lineDataFacet.of(lineData), expandedLineNumbersCompartment.of(expandedLineNumbersFacet.of([])), lineCommentsWidget(), lineCommentsGutter()];
}
