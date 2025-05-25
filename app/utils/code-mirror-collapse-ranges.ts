import type { LineRange } from 'codecrafters-frontend/components/code-mirror';

export function collapseRanges(collapsedRanges: LineRange[] = []) {
  return collapsedRanges ? [] : [];
}
