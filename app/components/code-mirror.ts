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
      document?: string;
      onDocumentUpdate?: (newValue: string) => void;
      filename?: string;
      language?: string;
      originalDocument?: string;
      indentUnit?: string;
      lineSeparator?: string;
      placeholder?: string;
      tabSize?: number;
      theme?: string;
      allowMultipleSelections?: boolean;
      autocompletion?: boolean;
      bracketMatching?: boolean;
      closeBrackets?: boolean;
      crosshairCursor?: boolean;
      drawSelection?: boolean;
      dropCursor?: boolean;
      editable?: boolean;
      foldGutter?: boolean;
      highlightActiveLine?: boolean;
      highlightSelectionMatches?: boolean;
      highlightSpecialChars?: boolean;
      highlightTrailingWhitespace?: boolean;
      highlightWhitespace?: boolean;
      history?: boolean;
      indentOnInput?: boolean;
      indentWithTab?: boolean;
      lineNumbers?: boolean;
      lineWrapping?: boolean;
      mergeControls?: boolean;
      preserveHistory?: boolean;
      readOnly?: boolean;
      rectangularSelection?: boolean;
      scrollPastEnd?: boolean;
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

  compartments: Map<string, Compartment> = Object.keys(OPTION_HANDLERS).reduce(function (map, optionName) {
    map.set(optionName, new Compartment());

    return map;
  }, new Map<string, Compartment>());

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

    if (['originalDocumentOrMergeControls'].includes(optionName)) {
      this.renderedView?.dispatch({
        effects: compartment?.reconfigure([]),
      });
    }

    this.renderedView?.dispatch({
      effects: compartment?.reconfigure(
        await (
          OPTION_HANDLERS[optionName] ||
          function (): Extension[] {
            return [];
          }
        )(newValue as undefined, this.args, optionName),
      ),
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
