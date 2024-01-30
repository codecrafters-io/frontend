import { SafeString } from 'handlebars';

type Chunk = {
  isAtTopOfFile?: boolean;
  isAtBottomOfFile?: boolean;
  isCollapsed: boolean;
  lines: Array<Line>;
};

type Line = {
  isTargetedByComments: boolean;
  isTargetedByExpandedComments: boolean;
  html: SafeString;
  type: string;
  number: number;
  comments: Array<Comment>;
  hasComments: boolean;
  commentsAreExpanded: boolean;
};

function getEndIndex(initialStart: number, lines: Array<Line>, linesAroundChangedChunk: number): number {
  let isTargetInSlice;
  let start = initialStart;
  let end = Math.min(start + linesAroundChangedChunk, lines.length);

  do {
    isTargetInSlice = false;

    for (let i = start; i < end; i++) {
      if (lines[i]?.type === 'added' || lines[i]?.type === 'removed') {
        isTargetInSlice = true;
        start = end;
        end = Math.min(i + linesAroundChangedChunk + 1, lines.length);
      }
    }
  } while (isTargetInSlice);

  return end;
}

function getExpandedChunks(lines: Array<Line>, linesAroundChangedChunk: number): Array<Chunk> {
  let nextTargetInfo = getNextTargetInfo(0, lines);
  let start;
  let end;
  const expandedChunks = [];

  if (nextTargetInfo.isPresent && nextTargetInfo.index !== null) {
    start = Math.max(nextTargetInfo.index - linesAroundChangedChunk, 0);
    end = getEndIndex(Math.min(nextTargetInfo.index + 1, lines.length - 1), lines, linesAroundChangedChunk);
  }

  while (nextTargetInfo.isPresent) {
    expandedChunks.push({
      isCollapsed: false,
      lines: lines.slice(start, end),
    });

    if (end) {
      nextTargetInfo = getNextTargetInfo(Math.min(end, lines.length), lines);
    }

    if (nextTargetInfo.index) {
      start = Math.max(nextTargetInfo.index - linesAroundChangedChunk, 0);
      end = getEndIndex(Math.min(nextTargetInfo.index + 1, lines.length - 1), lines, linesAroundChangedChunk);
    }
  }

  return expandedChunks;
}

function getNextTargetInfo(start: number, lines: Array<Line>): { isPresent: boolean; index: number | null } {
  let nextTargetInfo: { isPresent: boolean; index: number | null } = { isPresent: false, index: null };

  for (let i = start; i < lines.length; i++) {
    if (lines[i]?.type === 'added' || lines[i]?.type === 'removed') {
      nextTargetInfo = { isPresent: true, index: i };
      break;
    }
  }

  return nextTargetInfo;
}

function groupDiffLinesIntoChunks(
  lines: Array<Line>,
  linesAroundChangedChunk: number,
  minLinesBetweenChunksBeforeCollapsing: number,
  shouldCollapseUnchangedLines: boolean,
) {
  const chunks = [];
  const expandedChunks = getExpandedChunks(lines, linesAroundChangedChunk);
  let start = 0;
  let end;

  for (let i = 0; i < expandedChunks.length; i++) {
    if ((expandedChunks?.[i]?.lines?.[0]?.number as number) - 1 > start) {
      let isChunkBetweenExpandedChunksCollapsed = true;

      if (i - 1 >= 0) {
        const currentExpandedChunkStart = expandedChunks?.[i]?.lines?.[0]?.number as number;
        const previousExpandedChunkEnd = expandedChunks?.[i - 1]?.lines?.[(expandedChunks?.[i - 1]?.lines?.length as number) - 1]?.number as number;

        if (currentExpandedChunkStart - previousExpandedChunkEnd <= minLinesBetweenChunksBeforeCollapsing + 1) {
          isChunkBetweenExpandedChunksCollapsed = false;
        }
      }

      if (!shouldCollapseUnchangedLines) {
        isChunkBetweenExpandedChunksCollapsed = false;
      }

      end = (expandedChunks?.[i]?.lines?.[0]?.number as number) - 1;

      chunks.push({
        isCollapsedAtTop: start === 0,
        isCollapsedAtBottom: false,
        isCollapsed: isChunkBetweenExpandedChunksCollapsed,
        lines: lines.slice(start, end),
      });

      chunks.push(expandedChunks[i]);
      start = expandedChunks?.[i]?.lines?.[(expandedChunks?.[i]?.lines?.length as number) - 1]?.number as number;
    } else {
      chunks.push(expandedChunks[i]);
      start = expandedChunks?.[i]?.lines?.[(expandedChunks?.[i]?.lines?.length as number) - 1]?.number as number;
    }
  }

  if (start !== lines.length) {
    chunks.push({
      isCollapsedAtTop: false,
      isCollapsedAtBottom: true,
      isCollapsed: shouldCollapseUnchangedLines || false,
      lines: lines.slice(start, lines.length),
      number: chunks.length + 1,
    });
  }

  return chunks;
}

export default groupDiffLinesIntoChunks;
