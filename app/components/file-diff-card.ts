import { service } from '@ember/service';
import Component from '@glimmer/component';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import type { LineRange } from 'codecrafters-frontend/components/code-mirror';
import { codeCraftersDark, codeCraftersLight } from 'codecrafters-frontend/utils/code-mirror-themes';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    code?: string; // Code to render in CodeMirror/SyntaxHighlightedDiff
    collapsedRanges?: LineRange[]; // Enable collapsing of specified line ranges
    filename: string; // Filename to render in the header. Also used to auto-detect language for code formatting
    forceDarkTheme?: boolean; // Always render CodeMirror/SyntaxHighlightedDiff using Dark Theme
    highlightedRanges?: LineRange[]; // Enable highlighting of specified line ranges
    language: string; // Override language auto-detected from `filename` and set it manually
    useCodeMirror?: boolean; // Use CodeMirror instead of SyntaxHighlightedDiff for rendering the diff
  };
}

export default class FileDiffCardComponent extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  get codeMirrorTheme() {
    return this.darkMode.isEnabled || this.args.forceDarkTheme ? codeCraftersDark : codeCraftersLight;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FileDiffCard: typeof FileDiffCardComponent;
  }
}
