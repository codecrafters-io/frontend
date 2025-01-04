import Component from '@glimmer/component';
import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import {
  EditorView,
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  highlightTrailingWhitespace,
  highlightWhitespace,
  keymap,
  lineNumbers,
  placeholder,
  rectangularSelection,
  scrollPastEnd,
} from '@codemirror/view';
import { Compartment, EditorState, type Extension, type TransactionSpec } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { unifiedMergeView } from '@codemirror/merge';
import {
  Language,
  LanguageDescription,
  LanguageSupport,
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { markdown } from '@codemirror/lang-markdown';
import { highlightNewlines } from 'codecrafters-frontend/utils/code-mirror-highlight-newlines';
import { collapseUnchangedGutterWidgetClass } from 'codecrafters-frontend/utils/code-mirror-collapse-unchanged-gutter-widget-class';

function generateHTMLElement(src: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = src;

  return div.firstChild as HTMLElement;
}

enum FoldGutterIcon {
  Expanded = '<svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible; cursor: pointer;"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path></svg>',
  Collapsed = '<svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible; cursor: pointer;"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"></path></svg>',
}

type DocumentUpdateCallback = (newValue: string) => void;

type Argument = boolean | string | number | undefined | Extension | DocumentUpdateCallback;

type OptionHandler = (args: Signature['Args']['Named']) => Extension[] | Promise<Extension[]>;

const OPTION_HANDLERS: { [key: string]: OptionHandler } = {
  allowMultipleSelections: ({ allowMultipleSelections }) => [EditorState.allowMultipleSelections.of(!!allowMultipleSelections)],
  autocompletion: ({ autocompletion: enabled }) => (enabled ? [autocompletion(), keymap.of(completionKeymap)] : []),
  bracketMatching: ({ bracketMatching: enabled }) => (enabled ? [bracketMatching()] : []),
  closeBrackets: ({ closeBrackets: enabled }) => (enabled ? [closeBrackets(), keymap.of(closeBracketsKeymap)] : []),
  crosshairCursor: ({ crosshairCursor: enabled }) => (enabled ? [crosshairCursor()] : []),
  drawSelection: ({ drawSelection: enabled }) => (enabled ? [drawSelection()] : []),
  dropCursor: ({ dropCursor: enabled }) => (enabled ? [dropCursor()] : []),
  editable: ({ editable }) => [EditorView.editable.of(!!editable)],
  highlightActiveLine: ({ highlightActiveLine: enabled }) => (enabled ? [highlightActiveLine(), highlightActiveLineGutter()] : []),
  highlightNewlines: ({ highlightNewlines: enabled }) => (enabled ? [highlightNewlines()] : []),
  highlightSelectionMatches: ({ highlightSelectionMatches: enabled }) => (enabled ? [highlightSelectionMatches()] : []),
  highlightSpecialChars: ({ highlightSpecialChars: enabled }) => (enabled ? [highlightSpecialChars()] : []),
  highlightTrailingWhitespace: ({ highlightTrailingWhitespace: enabled }) => (enabled ? [highlightTrailingWhitespace()] : []),
  highlightWhitespace: ({ highlightWhitespace: enabled }) => (enabled ? [highlightWhitespace()] : []),
  history: ({ history: enabled }) => (enabled ? [history(), keymap.of(historyKeymap)] : []),
  indentOnInput: ({ indentOnInput: enabled }) => (enabled ? [indentOnInput()] : []),
  indentUnit: ({ indentUnit: indentUnitText }) => (indentUnitText !== undefined ? [indentUnit.of(indentUnitText)] : []),
  indentWithTab: ({ indentWithTab: enabled }) => (enabled ? [keymap.of([indentWithTab])] : []),
  lineNumbers: ({ lineNumbers: enabled }) => (enabled ? [lineNumbers()] : []),
  foldGutter: ({ foldGutter: enabled }) =>
    enabled
      ? [
          foldGutter({
            markerDOM: (open) => generateHTMLElement(open ? FoldGutterIcon.Expanded : FoldGutterIcon.Collapsed),
          }),
          keymap.of(foldKeymap),
        ]
      : [],
  lineSeparator: ({ lineSeparator: lineSeparatorText }) => (lineSeparatorText !== undefined ? [EditorState.lineSeparator.of(lineSeparatorText)] : []),
  lineWrapping: ({ lineWrapping }) => (lineWrapping ? [EditorView.lineWrapping] : []),
  placeholder: ({ placeholder: placeholderText }) => (placeholderText !== undefined ? [placeholder(placeholderText)] : []),
  readOnly: ({ readOnly }) => [EditorState.readOnly.of(!!readOnly)],
  rectangularSelection: ({ rectangularSelection: enabled }) => (enabled ? [rectangularSelection()] : []),
  scrollPastEnd: ({ scrollPastEnd: enabled }) => (enabled ? [scrollPastEnd()] : []),
  syntaxHighlighting: ({ syntaxHighlighting: enabled }) => (enabled ? [syntaxHighlighting(defaultHighlightStyle, { fallback: true })] : []),
  tabSize: ({ tabSize }) => (tabSize !== undefined ? [EditorState.tabSize.of(tabSize)] : []),
  theme: ({ theme }) => (theme !== undefined ? [theme] : []),
  languageOrFilename: async ({ language, filename }) => {
    const detectedLanguage = language
      ? LanguageDescription.matchLanguageName(languages, language)
      : filename
        ? LanguageDescription.matchFilename(languages, filename)
        : undefined;

    let loadedLanguage: Language | LanguageSupport | undefined;

    if (detectedLanguage) {
      switch (detectedLanguage.name.toLowerCase()) {
        case 'markdown':
          loadedLanguage = markdown({ codeLanguages: languages });
          break;
        default:
          loadedLanguage = await detectedLanguage.load();
          break;
      }
    }

    return loadedLanguage ? [loadedLanguage] : [];
  },
  originalDocumentOrDiffRelatedOption: ({
    originalDocument,
    mergeControls,
    collapseUnchanged,
    highlightChanges,
    syntaxHighlighting,
    syntaxHighlightDeletions,
    unchangedMargin = 3,
    unchangedMinSize = 4,
  }) => {
    return originalDocument
      ? [
          unifiedMergeView({
            original: originalDocument,
            mergeControls: !!mergeControls,
            collapseUnchanged: collapseUnchanged ? { margin: unchangedMargin, minSize: unchangedMinSize } : undefined,
            highlightChanges: !!highlightChanges,
            syntaxHighlightDeletions: !!syntaxHighlighting && !!syntaxHighlightDeletions,
          }),
          collapseUnchangedGutterWidgetClass(),
        ]
      : [];
  },
};

export interface Signature {
  Element: Element;
  Args: {
    Named: {
      [key: string]: Argument;
      /**
       * Document for the editor to render & edit
       */
      document?: string;
      /**
       * Function to call when document is edited inside the editor
       * @param newValue string New value of the document
       */
      onDocumentUpdate?: DocumentUpdateCallback;
      /**
       * Pass a filename to automatically detect language based on file name and extension
       */
      filename?: string;
      /**
       * Explicitly pass a language to the editor
       */
      language?: string;
      /**
       * Enable unified diff editor by passing the original document
       */
      originalDocument?: string;
      /**
       * Symbols to use for indentation with `indentOnInput` and `indentWithTab` (does NOT reformat document upon loading)
       */
      indentUnit?: string;
      /**
       * Line ending separator to use when Enter is pressed in editor (does NOT reformat document upon loading)
       */
      lineSeparator?: string;
      /**
       * Placeholder text to show when document is empty or not passed
       */
      placeholder?: string;
      /**
       * Number of spaces to use for representing the TAB character visually
       */
      tabSize?: number;
      /**
       * Theme to use for the editor
       */
      theme?: Extension;
      /**
       * Allow multiple selections by using CTRL/CMD key
       */
      allowMultipleSelections?: boolean;
      /**
       * Enable auto-completion
       */
      autocompletion?: boolean;
      /**
       * Enable highlighting of matching brackets
       */
      bracketMatching?: boolean;
      /**
       * Automatically close brackets when typing
       */
      closeBrackets?: boolean;
      /**
       * Use a crosshair cursor over the editor when ALT key is pressed
       */
      crosshairCursor?: boolean;
      /**
       * Use a custom method for selection drawing instead of the browser's built-in, allows multiple selections and other goodies
       */
      drawSelection?: boolean;
      /**
       * Draw a blinking edit cursor to indicate where pasting will occur when a file is dragged over the editor
       */
      dropCursor?: boolean;
      /**
       * Present the editor as an editable & focusable control, sets the DOM `contenteditable` attribute, do not confuse with `readOnly`
       */
      editable?: boolean;
      /**
       * Enable code folding & the fold gutter
       */
      foldGutter?: boolean;
      /**
       * Enable highlighting of active line
       */
      highlightActiveLine?: boolean;
      /**
       * Enable inline highlighting of changes in the diff
       */
      highlightChanges?: boolean;
      /**
       * Enable highlighting of new line symbols
       */
      highlightNewlines?: boolean;
      /**
       * Enable highlighting of current selection matches in the document
       */
      highlightSelectionMatches?: boolean;
      /**
       * Enable highlighting of invisible characters, such as `U+200E`
       */
      highlightSpecialChars?: boolean;
      /**
       * Enable highlighting of trailing whitespace
       */
      highlightTrailingWhitespace?: boolean;
      /**
       * Enable highlighting of whitespace
       */
      highlightWhitespace?: boolean;
      /**
       * Enable changes history and undo/redo keymap
       */
      history?: boolean;
      /**
       * Enable automatic indentation (in languages that support/require it)
       */
      indentOnInput?: boolean;
      /**
       * Enable indentation of lines or selection using TAB and Shift+TAB keys, otherwise editor loses focus when TAB is pressed
       */
      indentWithTab?: boolean;
      /**
       * Enable the line numbers gutter
       */
      lineNumbers?: boolean;
      /**
       * Enable visual line wrapping for lines exceeding editor width
       */
      lineWrapping?: boolean;
      /**
       * Enable showing accept/reject buttons in the diff editor
       */
      mergeControls?: boolean;
      /**
       * Enable collapsing unchanged lines in the diff editor
       */
      collapseUnchanged?: boolean;
      /**
       * Preserve changes history when parent component passes a new `@document` to the component
       */
      preserveHistory?: boolean;
      /**
       * Make the document in the editor read-only, disable commands and other mutating extensions, do not confuse with `editable`
       */
      readOnly?: boolean;
      /**
       * Allow drawing rectangular selections by using ALT key
       */
      rectangularSelection?: boolean;
      /**
       * Allow scrolling past the end of the document
       */
      scrollPastEnd?: boolean;
      /**
       * Enable syntax highlighting (using a theme enables syntax highlighting automatically)
       */
      syntaxHighlighting?: boolean;
      /**
       * Enable syntax highlighting in the deleted chunks of the diff
       */
      syntaxHighlightDeletions?: boolean;
      /**
       * Number of lines to leave visible after/before a change before collapsing unchanged lines
       */
      unchangedMargin?: number;
      /**
       * Minimum number of collapsible lines required to be present for collapsing unchanged lines
       */
      unchangedMinSize?: number;
    };
  };
  Blocks: { default?: [] };
}

export default class CodeMirrorComponent extends Component<Signature> {
  renderedView: EditorView | null = null;

  compartments: Map<string, Compartment> = new Map(Object.keys(OPTION_HANDLERS).map((optionName) => [optionName, new Compartment()]));

  @action
  @waitFor
  async documentDidChange(_element: Element, [newValue]: [string | undefined]) {
    if (!this.renderedView || this.renderedView.state.doc.toString() === newValue) {
      return;
    }

    if (this.args.history && !this.args.preserveHistory) {
      this.#updateRenderedView({
        effects: this.#resetCompartment('history'),
      });
      this.#updateRenderedView({
        effects: await this.#updateCompartment('history'),
      });
    }

    this.#updateRenderedView(
      this.renderedView.state.update({
        changes: {
          from: 0,
          to: this.renderedView.state.doc.length,
          insert: newValue,
        },
      }),
    );
  }

  @action
  @waitFor
  async optionDidChange(_element: Element, [optionName, _monitoredProperty]: [string, unknown]) {
    if (!this.renderedView) {
      return;
    }

    // When originalDocument changes - completely unload the diff compartment to avoid any side-effects
    if (optionName === 'originalDocumentOrDiffRelatedOption') {
      this.#updateRenderedView({
        effects: this.#resetCompartment('originalDocumentOrDiffRelatedOption'),
      });
    }

    // Reconfigure the changed compartment with new options and dispatch new effects to the view
    this.#updateRenderedView({
      effects: await this.#updateCompartment(optionName),
    });

    // When syntaxHighlighting changes - reload the diff compartment to also re-configure syntaxHighlightDeletions
    if (optionName === 'syntaxHighlighting') {
      this.#updateRenderedView({
        effects: this.#resetCompartment('originalDocumentOrDiffRelatedOption'),
      });
      this.#updateRenderedView({
        effects: await this.#updateCompartment('originalDocumentOrDiffRelatedOption'),
      });
    }

    // When lineSeparator changes - completely reload the document to avoid any side-effects
    if (optionName === 'lineSeparator') {
      this.#updateRenderedView(
        this.renderedView.state.update({
          changes: {
            from: 0,
            to: this.renderedView.state.doc.length,
            insert: this.args.document,
          },
        }),
      );
    }
  }

  @action
  @waitFor
  async renderEditor(element: Element) {
    this.renderedView = new EditorView({
      parent: element,
      doc: this.args.document,
      extensions: [
        EditorState.phrases.of({
          '$ unchanged lines': 'Expand $ unchanged lines',
        }),

        keymap.of(defaultKeymap),

        ...(await Promise.all(
          Object.keys(OPTION_HANDLERS).map(async (optionName) => {
            return this.compartments.get(optionName)?.of(OPTION_HANDLERS[optionName] ? await OPTION_HANDLERS[optionName](this.args) : []) || [];
          }),
        )),

        EditorView.updateListener.of((update) => {
          if (update.docChanged && typeof this.args.onDocumentUpdate === 'function') {
            this.args.onDocumentUpdate(update.state.doc.toString());
          }
        }),
      ],
    });
  }

  #resetCompartment(key: string) {
    return this.compartments.get(key)?.reconfigure([]);
  }

  async #updateCompartment(key: string) {
    return this.compartments.get(key)?.reconfigure(OPTION_HANDLERS[key] ? await OPTION_HANDLERS[key](this.args) : []);
  }

  #updateRenderedView(...specs: TransactionSpec[]) {
    return this.renderedView?.dispatch(...specs);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeMirror: typeof CodeMirrorComponent;
  }
}
