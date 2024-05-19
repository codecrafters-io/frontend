import Component from '@glimmer/component';
import { action } from '@ember/object';

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
import { type Extension, Compartment, EditorState } from '@codemirror/state';
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

import { githubDark, githubLight } from '@uiw/codemirror-theme-github';

const THEME_EXTENSIONS: {
  [key: string]: Extension;
} = {
  githubDark,
  githubLight,
};

type Argument = boolean | string | number | ((newValue: string) => void) | undefined;

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
      onDocumentUpdate?: (newValue: string) => void;
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
      theme?: string;
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
    };
  };
  Blocks: { default?: [] };
}

type OptionHandler = (newValue: undefined, args: Signature['Args']['Named'], changedOptionName?: string) => Extension[] | Promise<Extension[]>;

export interface OptionHandlersSignature {
  [key: string]: OptionHandler;
  allowMultipleSelections: (enabled?: boolean) => Extension[];
  autocompletion: (enabled?: boolean) => Extension[];
  bracketMatching: (enabled?: boolean) => Extension[];
  closeBrackets: (enabled?: boolean) => Extension[];
  crosshairCursor: (enabled?: boolean) => Extension[];
  drawSelection: (enabled?: boolean) => Extension[];
  dropCursor: (enabled?: boolean) => Extension[];
  editable: (enabled?: boolean) => Extension[];
  foldGutter: (enabled?: boolean) => Extension[];
  highlightActiveLine: (enabled?: boolean) => Extension[];
  highlightSelectionMatches: (enabled?: boolean) => Extension[];
  highlightSpecialChars: (enabled?: boolean) => Extension[];
  highlightTrailingWhitespace: (enabled?: boolean) => Extension[];
  highlightWhitespace: (enabled?: boolean) => Extension[];
  history: (enabled?: boolean) => Extension[];
  indentOnInput: (enabled?: boolean) => Extension[];
  indentUnit: (indentUnitText?: string) => Extension[];
  indentWithTab: (enabled?: boolean) => Extension[];
  lineNumbers: (enabled?: boolean) => Extension[];
  lineSeparator: (lineSeparatorText?: string) => Extension[];
  lineWrapping: (enabled?: boolean) => Extension[];
  placeholder: (placeholderText?: string) => Extension[];
  readOnly: (enabled?: boolean) => Extension[];
  rectangularSelection: (enabled?: boolean) => Extension[];
  scrollPastEnd: (enabled?: boolean) => Extension[];
  syntaxHighlighting: (enabled?: boolean) => Extension[];
  tabSize: (tabSize?: number) => Extension[];
  theme: (theme?: string) => Extension[];
  languageOrFilename: (newValue: string | undefined, args: Signature['Args']['Named'], changedOptionName?: string) => Promise<Extension[]>;
  originalDocumentOrMergeControls: (
    newValue: string | boolean | undefined,
    args: Signature['Args']['Named'],
    changedOptionName?: string,
  ) => Extension[];
}

const OPTION_HANDLERS: OptionHandlersSignature = {
  allowMultipleSelections: (enabled) => [EditorState.allowMultipleSelections.of(!!enabled)],
  autocompletion: (enabled) => (enabled ? [autocompletion(), keymap.of(completionKeymap)] : []),
  bracketMatching: (enabled) => (enabled ? [bracketMatching()] : []),
  closeBrackets: (enabled) => (enabled ? [closeBrackets(), keymap.of(closeBracketsKeymap)] : []),
  crosshairCursor: (enabled) => (enabled ? [crosshairCursor()] : []),
  drawSelection: (enabled) => (enabled ? [drawSelection()] : []),
  dropCursor: (enabled) => (enabled ? [dropCursor()] : []),
  editable: (enabled) => [EditorView.editable.of(!!enabled)],
  foldGutter: (enabled) => (enabled ? [foldGutter(), keymap.of(foldKeymap)] : []),
  highlightActiveLine: (enabled) => (enabled ? [highlightActiveLine(), highlightActiveLineGutter()] : []),
  highlightSelectionMatches: (enabled) => (enabled ? [highlightSelectionMatches()] : []),
  highlightSpecialChars: (enabled) => (enabled ? [highlightSpecialChars()] : []),
  highlightTrailingWhitespace: (enabled) => (enabled ? [highlightTrailingWhitespace()] : []),
  highlightWhitespace: (enabled) => (enabled ? [highlightWhitespace()] : []),
  history: (enabled) => (enabled ? [history(), keymap.of(historyKeymap)] : []),
  indentOnInput: (enabled) => (enabled ? [indentOnInput()] : []),
  indentUnit: (indentUnitText) => (indentUnitText !== undefined ? [indentUnit.of(indentUnitText)] : []),
  indentWithTab: (enabled) => (enabled ? [keymap.of([indentWithTab])] : []),
  lineNumbers: (enabled) => (enabled ? [lineNumbers()] : []),
  lineSeparator: (lineSeparatorText) => (lineSeparatorText !== undefined ? [EditorState.lineSeparator.of(lineSeparatorText)] : []),
  lineWrapping: (enabled) => (enabled ? [EditorView.lineWrapping] : []),
  placeholder: (placeholderText) => (placeholderText !== undefined ? [placeholder(placeholderText)] : []),
  readOnly: (enabled) => [EditorState.readOnly.of(!!enabled)],
  rectangularSelection: (enabled) => (enabled ? [rectangularSelection()] : []),
  scrollPastEnd: (enabled) => (enabled ? [scrollPastEnd()] : []),
  syntaxHighlighting: (enabled) => (enabled ? [syntaxHighlighting(defaultHighlightStyle, { fallback: true })] : []),
  tabSize: (tabSize) => (tabSize !== undefined ? [EditorState.tabSize.of(tabSize)] : []),
  theme: (theme) => (theme !== undefined ? [THEME_EXTENSIONS[theme] || []] : []),
  languageOrFilename: async (_newValue, { language, filename }) => {
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
  originalDocumentOrMergeControls: (_newValue, { originalDocument, mergeControls }) => {
    return originalDocument
      ? [
          unifiedMergeView({
            original: originalDocument,
            mergeControls: !!mergeControls,
            // collapseUnchanged: { margin: 3, minSize: 4 },
          }),
        ]
      : [];
  },
};

export default class CodeMirrorComponent extends Component<Signature> {
  renderedView: EditorView | null = null;

  compartments: Map<string, Compartment> = new Map(Object.keys(OPTION_HANDLERS).map((optionName) => [optionName, new Compartment()]));

  @action documentDidChange(_element: Element, [newValue]: [string | undefined]) {
    const documentChanged = this.renderedView?.state.doc.toString() !== newValue;

    if (!documentChanged || !this.renderedView) {
      return;
    }

    if (this.args.history && !this.args.preserveHistory) {
      this.renderedView.dispatch({
        effects: this.compartments.get('history')?.reconfigure([]),
      });
      this.renderedView.dispatch({
        effects: this.compartments.get('history')?.reconfigure(OPTION_HANDLERS.history(this.args.history)),
      });
    }

    this.renderedView.dispatch(
      this.renderedView.state.update({
        changes: {
          from: 0,
          to: this.renderedView.state.doc.length,
          insert: newValue,
        },
      }),
    );
  }

  @action async optionDidChange(optionName: string, _element: Element, [newValue]: [boolean | string | number | undefined]) {
    const compartment = this.compartments.get(optionName);
    const handlerMethod = OPTION_HANDLERS[optionName];

    // some compartments need to be unloaded before new changes are applied
    if (['originalDocumentOrMergeControls'].includes(optionName)) {
      this.renderedView?.dispatch({
        effects: compartment?.reconfigure([]),
      });
    }

    this.renderedView?.dispatch({
      effects: compartment?.reconfigure(handlerMethod ? await handlerMethod(newValue as undefined, this.args, optionName) : []),
    });
  }

  @action async renderEditor(element: Element) {
    this.renderedView = new EditorView({
      parent: element,
      doc: this.args.document,
      extensions: [
        keymap.of(defaultKeymap),

        ...(await Promise.all(
          Object.keys(OPTION_HANDLERS).map(async (optionName) => {
            const compartment = this.compartments.get(optionName) || new Compartment();
            const handlerMethod = OPTION_HANDLERS[optionName];

            return compartment.of(handlerMethod ? await handlerMethod(this.args[optionName] as undefined, this.args) : []);
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeMirror: typeof CodeMirrorComponent;
  }
}
