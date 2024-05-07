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
import { Compartment, EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { unifiedMergeView } from '@codemirror/merge';
import {
  LanguageDescription,
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

import * as THEME_EXTENSIONS from '@uiw/codemirror-themes-all';

// const basicSetup = [
//   keymap.of([
//     ...searchKeymap,
//     ...lintKeymap
//   ]),
// ];

const SUPPORTED_THEMES = Object.keys(THEME_EXTENSIONS).filter((key) => !(key.startsWith('defaultSettings') || key.endsWith('Init')));

const OPTION_HANDLERS = {
  // simple ones, mostly :)
  allowMultipleSelections: (enabled) => [EditorState.allowMultipleSelections.of(enabled)],
  autocompletion: (enabled) => (enabled ? [autocompletion(), keymap.of(completionKeymap)] : []),
  bracketMatching: (enabled) => (enabled ? [bracketMatching()] : []),
  closeBrackets: (enabled) => (enabled ? [closeBrackets(), keymap.of(closeBracketsKeymap)] : []),
  crosshairCursor: (enabled) => (enabled ? [crosshairCursor()] : []),
  drawSelection: (enabled) => (enabled ? [drawSelection()] : []),
  dropCursor: (enabled) => (enabled ? [dropCursor()] : []),
  editable: (enabled) => [EditorView.editable.of(enabled)],
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
  readOnly: (enabled) => [EditorState.readOnly.of(enabled)],
  rectangularSelection: (enabled) => (enabled ? [rectangularSelection()] : []),
  scrollPastEnd: (enabled) => (enabled ? [scrollPastEnd()] : []),
  syntaxHighlighting: (enabled) => (enabled ? [syntaxHighlighting(defaultHighlightStyle, { fallback: true })] : []),
  tabSize: (enabled) => (enabled !== undefined ? [EditorState.tabSize.of(enabled)] : []),
  theme: (theme) => (theme !== undefined && SUPPORTED_THEMES.includes(theme) ? [THEME_EXTENSIONS[theme]] : []),
  // advanced handling
  languageOrFilename: async (newValue, { language, filename }) => {
    const detectedLanguage = language
      ? LanguageDescription.matchLanguageName(languages, language)
      : filename
        ? LanguageDescription.matchFilename(languages, filename)
        : undefined;

    let loadedLanguage = [];

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
  originalDocumentOrMergeControls: (newValue, { originalDocument, mergeControls }) => {
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

export default class CodeMirrorComponent extends Component {
  renderedView;

  compartments = Object.keys(OPTION_HANDLERS).reduce(function (accumulator, optionName) {
    accumulator[optionName] = new Compartment();

    return accumulator;
  }, {});

  @action documentDidChange(element, [newValue]) {
    const documentChanged = this.renderedView.state.doc.toString() !== newValue;

    if (!documentChanged) {
      return;
    }

    if (this.args.history && !this.args.preserveHistory) {
      this.renderedView.dispatch({
        effects: [this.compartments.history.reconfigure([])],
      });
      this.renderedView.dispatch({
        effects: [this.compartments.history.reconfigure(OPTION_HANDLERS.history(this.args.history, this.args))],
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

  @action async optionDidChange(optionName, element, [newValue]) {
    const compartment = this.compartments[optionName];

    if (['originalDocumentOrMergeControls'].includes(optionName)) {
      this.renderedView.dispatch({
        effects: [compartment.reconfigure([])],
      });
    }

    this.renderedView.dispatch({
      effects: [compartment.reconfigure(await OPTION_HANDLERS[optionName](newValue, this.args, optionName))],
    });
  }

  @action
  async renderEditor(element) {
    this.renderedView = new EditorView({
      parent: element,
      doc: this.args.document,
      extensions: [
        keymap.of(defaultKeymap),

        ...(await Promise.all(
          Object.keys(OPTION_HANDLERS).map(async (optionName) => {
            return this.compartments[optionName].of(await OPTION_HANDLERS[optionName](this.args[optionName], this.args));
          }),
        )),

        EditorView.updateListener.of((update) => {
          if (update.docChanged && typeof this.args.onUpdate == 'function') {
            this.args.onUpdate(update.state.doc.toString());
          }
        }),
      ],
    });
  }
}
