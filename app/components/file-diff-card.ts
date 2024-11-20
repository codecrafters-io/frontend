import { service } from '@ember/service';
import Component from '@glimmer/component';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import { codeCraftersDark, codeCraftersLight } from 'codecrafters-frontend/utils/code-mirror-themes';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    /**
     * Code to render in CodeMirror/SyntaxHighlightedDiff
     */
    code?: string;
    /**
     * Filename to render in the header.
     * Also used to auto-detect language for code formatting
     */
    filename: string;
    /**
     * Always render CodeMirror/SyntaxHighlightedDiff using Dark Theme
     */
    forceDarkTheme?: boolean;
    /**
     * Override language auto-detected from `filename` and set it manually
     */
    language: string;
    /**
     * Use CodeMirror instead of SyntaxHighlightedDiff for rendering the diff
     */
    useCodeMirror?: boolean;
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
