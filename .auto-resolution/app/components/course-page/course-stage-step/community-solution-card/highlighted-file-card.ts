import Component from '@glimmer/component';
import { service } from '@ember/service';
import type CommunityCourseStageSolution from 'codecrafters-frontend/models/community-course-stage-solution';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import { codeCraftersDark, codeCraftersLight } from 'codecrafters-frontend/utils/code-mirror-themes';
import type { LineRange } from 'codecrafters-frontend/components/code-mirror';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    highlightedFile: NonNullable<CommunityCourseStageSolution['highlightedFiles']>[number];
    onPublishToGithubButtonClick: () => void;
    solution: CommunityCourseStageSolution;
  };
}

export default class HighlightedFileCard extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  get codeMirrorTheme() {
    return this.darkMode.isEnabled ? codeCraftersDark : codeCraftersLight;
  }

  get collapsedRangesForCodeMirror(): LineRange[] {
    const totalLines = this.args.highlightedFile.contents.split('\n').length;
    const visibleRanges = this.visibleRangesForCodeMirror;

    if (visibleRanges.length === 0) {
      return [];
    }

    const collapsedRanges: LineRange[] = [];
    const firstRange = visibleRanges[0]!;
    const lastRange = visibleRanges[visibleRanges.length - 1]!;

    // Collapse before first range
    if (firstRange.startLine > 1) {
      collapsedRanges.push({ startLine: 1, endLine: firstRange.startLine - 1 });
    }

    // Collapse between ranges if gap is at least 3 lines
    for (let i = 0; i < visibleRanges.length - 1; i++) {
      const gap = visibleRanges[i + 1]!.startLine - visibleRanges[i]!.endLine - 1;

      if (gap > 3) {
        collapsedRanges.push({
          startLine: visibleRanges[i]!.endLine + 1,
          endLine: visibleRanges[i + 1]!.startLine - 1,
        });
      }
    }

    // Collapse after last range
    if (lastRange.endLine < totalLines) {
      collapsedRanges.push({ startLine: lastRange.endLine + 1, endLine: totalLines });
    }

    return collapsedRanges;
  }

  get highlightedRangesForCodeMirror(): LineRange[] {
    return this.args.highlightedFile.highlighted_ranges.map((range) => ({
      startLine: range.start_line,
      endLine: range.end_line,
    }));
  }

  get visibleRangesForCodeMirror(): LineRange[] {
    // Add 3 lines above and below the highlighted range
    const ranges = this.args.highlightedFile.highlighted_ranges.map((range) => ({
      startLine: Math.max(1, range.start_line - 3),
      endLine: Math.min(this.args.highlightedFile.contents.split('\n').length, range.end_line + 3),
    }));

    // Sort ranges by start line and merge overlapping ones
    return ranges
      .sort((a, b) => a.startLine - b.startLine)
      .reduce((mergedRanges: LineRange[], currentRange) => {
        if (mergedRanges.length === 0 || mergedRanges[mergedRanges.length - 1]!.endLine < currentRange.startLine) {
          mergedRanges.push(currentRange);
        } else {
          mergedRanges[mergedRanges.length - 1]!.endLine = currentRange.endLine;
        }

        return mergedRanges;
      }, []);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::HighlightedFileCard': typeof HighlightedFileCard;
  }
}
