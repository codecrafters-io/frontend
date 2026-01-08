import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { type Extension } from '@codemirror/state';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import { codeCraftersDark, codeCraftersLight } from 'codecrafters-frontend/utils/code-mirror-themes';
import EXAMPLE_DOCUMENTS, { ExampleDocument } from 'codecrafters-frontend/utils/code-mirror-documents';

const THEME_EXTENSIONS: {
  [key: string]: Extension;
} = {
  codeCraftersLight,
  codeCraftersDark,
};

const SUPPORTED_THEMES = [...Object.keys(THEME_EXTENSIONS), 'codeCraftersAuto'];

const INDENT_UNITS = [
  { name: 'Tab', symbol: '\t' },
  { name: '2 Spaces', symbol: '  ' },
  { name: '4 Spaces', symbol: '    ' },
];

const LINE_SEPARATORS = [
  { name: '\\r\\n', symbol: '\r\n' },
  { name: '\\n', symbol: '\n' },
  { name: '\\r', symbol: '\r' },
];

const OPTION_DEFAULTS = {
  allowInlineDiffs: false,
  allowMultipleSelections: true,
  autocompletion: true,
  bracketMatching: true,
  closeBrackets: true,
  collapsedRanges: false,
  collapseUnchanged: true,
  crosshairCursor: true,
  document: true,
  drawSelection: true,
  dropCursor: true,
  editable: true,
  filename: true,
  foldGutter: true,
  highlightActiveLine: true,
  highlightChanges: false,
  highlightedRanges: false,
  highlightNewlines: false,
  highlightSelectionMatches: true,
  highlightSpecialChars: true,
  highlightTrailingWhitespace: true,
  highlightWhitespace: true,
  history: true,
  indentOnInput: true,
  indentUnit: true,
  indentWithTab: true,
  language: true,
  lineNumbers: true,
  lineSeparator: true,
  lineWrapping: true,
  maxHeight: true,
  mergeControls: true,
  originalDocument: false,
  outline: true,
  placeholder: true,
  preserveHistory: false,
  readOnly: false,
  rectangularSelection: true,
  scrollPastEnd: false,
  selectedDocumentIndex: 1,
  selectedIndentUnitIndex: 1,
  selectedLineSeparatorIndex: 1,
  selectedTabSizeIndex: 2,
  selectedThemeIndex: SUPPORTED_THEMES.indexOf('codeCraftersAuto'),
  selectedUnchangedMarginIndex: 2,
  selectedUnchangedMinSizeIndex: 3,
  syntaxHighlightDeletions: true,
  syntaxHighlighting: true,
  tabSize: true,
  theme: true,
  unchangedMargin: true,
  unchangedMinSize: true,
};

export default class DemoCodeMirrorController extends Controller {
  @service declare darkMode: DarkModeService;

  queryParams = [
    'allowInlineDiffs',
    'allowMultipleSelections',
    'autocompletion',
    'bracketMatching',
    'closeBrackets',
    'collapsedRanges',
    'collapseUnchanged',
    'crosshairCursor',
    'document',
    'drawSelection',
    'dropCursor',
    'editable',
    'filename',
    'foldGutter',
    'highlightActiveLine',
    'highlightChanges',
    'highlightedRanges',
    'highlightNewlines',
    'highlightSelectionMatches',
    'highlightSpecialChars',
    'highlightTrailingWhitespace',
    'highlightWhitespace',
    'history',
    'indentOnInput',
    'indentUnit',
    'indentWithTab',
    'language',
    'lineNumbers',
    'lineSeparator',
    'lineWrapping',
    'maxHeight',
    'mergeControls',
    'originalDocument',
    'outline',
    'placeholder',
    'preserveHistory',
    'readOnly',
    'rectangularSelection',
    'scrollPastEnd',
    'selectedDocumentIndex',
    'selectedIndentUnitIndex',
    'selectedLineSeparatorIndex',
    'selectedTabSizeIndex',
    'selectedThemeIndex',
    'selectedUnchangedMarginIndex',
    'selectedUnchangedMinSizeIndex',
    'syntaxHighlightDeletions',
    'syntaxHighlighting',
    'tabSize',
    'theme',
    'unchangedMargin',
    'unchangedMinSize',
  ];

  @tracked documents: ExampleDocument[] = EXAMPLE_DOCUMENTS;
  @tracked indentUnits = INDENT_UNITS;
  @tracked placeholderMessage = 'Welcome to CodeCrafters test zone for CodeMirror! Start editing the document here...';
  @tracked tabSizes = [1, 2, 4, 6, 8, 10, 12, 16];
  @tracked themes = [...SUPPORTED_THEMES];
  @tracked unchangedMargins = [1, 2, 3, 4, 5, 8, 16];
  @tracked unchangedMinSizes = [1, 2, 3, 4, 5, 8, 16];

  @tracked allowInlineDiffs = OPTION_DEFAULTS.allowInlineDiffs;
  @tracked allowMultipleSelections = OPTION_DEFAULTS.allowMultipleSelections;
  @tracked autocompletion = OPTION_DEFAULTS.autocompletion;
  @tracked bracketMatching = OPTION_DEFAULTS.bracketMatching;
  @tracked closeBrackets = OPTION_DEFAULTS.closeBrackets;
  @tracked collapsedRanges = OPTION_DEFAULTS.collapsedRanges;
  @tracked collapseUnchanged = OPTION_DEFAULTS.collapseUnchanged;
  @tracked crosshairCursor = OPTION_DEFAULTS.crosshairCursor;
  @tracked document = OPTION_DEFAULTS.document;
  @tracked drawSelection = OPTION_DEFAULTS.drawSelection;
  @tracked dropCursor = OPTION_DEFAULTS.dropCursor;
  @tracked editable = OPTION_DEFAULTS.editable;
  @tracked filename = OPTION_DEFAULTS.filename;
  @tracked foldGutter = OPTION_DEFAULTS.foldGutter;
  @tracked highlightActiveLine = OPTION_DEFAULTS.highlightActiveLine;
  @tracked highlightChanges = OPTION_DEFAULTS.highlightChanges;
  @tracked highlightedRanges = OPTION_DEFAULTS.highlightedRanges;
  @tracked highlightNewlines = OPTION_DEFAULTS.highlightNewlines;
  @tracked highlightSelectionMatches = OPTION_DEFAULTS.highlightSelectionMatches;
  @tracked highlightSpecialChars = OPTION_DEFAULTS.highlightSpecialChars;
  @tracked highlightTrailingWhitespace = OPTION_DEFAULTS.highlightTrailingWhitespace;
  @tracked highlightWhitespace = OPTION_DEFAULTS.highlightWhitespace;
  @tracked history = OPTION_DEFAULTS.history;
  @tracked indentOnInput = OPTION_DEFAULTS.indentOnInput;
  @tracked indentUnit = OPTION_DEFAULTS.indentUnit;
  @tracked indentWithTab = OPTION_DEFAULTS.indentWithTab;
  @tracked language = OPTION_DEFAULTS.language;
  @tracked lineNumbers = OPTION_DEFAULTS.lineNumbers;
  @tracked lineSeparator = OPTION_DEFAULTS.lineSeparator;
  @tracked lineSeparators = LINE_SEPARATORS;
  @tracked lineWrapping = OPTION_DEFAULTS.lineWrapping;
  @tracked maxHeight = OPTION_DEFAULTS.maxHeight;
  @tracked mergeControls = OPTION_DEFAULTS.mergeControls;
  @tracked originalDocument = OPTION_DEFAULTS.originalDocument;
  @tracked outline = OPTION_DEFAULTS.outline;
  @tracked placeholder = OPTION_DEFAULTS.placeholder;
  @tracked preserveHistory = OPTION_DEFAULTS.preserveHistory;
  @tracked readOnly = OPTION_DEFAULTS.readOnly;
  @tracked rectangularSelection = OPTION_DEFAULTS.rectangularSelection;
  @tracked scrollPastEnd = OPTION_DEFAULTS.scrollPastEnd;
  @tracked selectedDocumentIndex = OPTION_DEFAULTS.selectedDocumentIndex;
  @tracked selectedIndentUnitIndex = OPTION_DEFAULTS.selectedIndentUnitIndex;
  @tracked selectedLineSeparatorIndex = OPTION_DEFAULTS.selectedLineSeparatorIndex;
  @tracked selectedTabSizeIndex = OPTION_DEFAULTS.selectedTabSizeIndex;
  @tracked selectedThemeIndex = OPTION_DEFAULTS.selectedThemeIndex;
  @tracked selectedUnchangedMarginIndex = OPTION_DEFAULTS.selectedUnchangedMarginIndex;
  @tracked selectedUnchangedMinSizeIndex = OPTION_DEFAULTS.selectedUnchangedMinSizeIndex;
  @tracked syntaxHighlightDeletions = OPTION_DEFAULTS.syntaxHighlightDeletions;
  @tracked syntaxHighlighting = OPTION_DEFAULTS.syntaxHighlighting;
  @tracked tabSize = OPTION_DEFAULTS.tabSize;
  @tracked theme = OPTION_DEFAULTS.theme;
  @tracked unchangedMargin = OPTION_DEFAULTS.unchangedMargin;
  @tracked unchangedMinSize = OPTION_DEFAULTS.unchangedMinSize;

  get selectedDocument() {
    return this.documents[this.selectedDocumentIndex] || ExampleDocument.createEmpty();
  }

  get selectedIndentUnit() {
    return this.indentUnits[this.selectedIndentUnitIndex];
  }

  get selectedLineSeparator() {
    return this.lineSeparators[this.selectedLineSeparatorIndex];
  }

  get selectedTabSize() {
    return this.tabSizes[this.selectedTabSizeIndex];
  }

  get selectedTheme() {
    const theme = this.themes[this.selectedThemeIndex];

    const themeMap: {
      [key: string]: Extension;
    } = {
      codeCraftersLight,
      codeCraftersDark,
      codeCraftersAuto: this.darkMode.isEnabled ? codeCraftersDark : codeCraftersLight,
    };

    return theme !== undefined ? themeMap[theme] : undefined;
  }

  get selectedUnchangedMargin() {
    return this.unchangedMargins[this.selectedUnchangedMarginIndex];
  }

  get selectedUnchangedMinSize() {
    return this.unchangedMinSizes[this.selectedUnchangedMinSizeIndex];
  }

  @action documentDidChange(_target: Controller, newValue: string) {
    if (!this.document) {
      return; // Don't overwrite the document if it's not being passed!
    }

    if (this.selectedDocument?.document !== newValue) {
      this.selectedDocument!.document = newValue;
    }
  }

  @action resetAllOptions() {
    Object.assign(this, OPTION_DEFAULTS);
  }

  @action selectedDocumentIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedDocumentIndex = target.selectedIndex;
  }

  @action selectedIndentUnitIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedIndentUnitIndex = target.selectedIndex;
  }

  @action selectedLineSeparatorIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedLineSeparatorIndex = target.selectedIndex;
  }

  @action selectedTabSizeIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedTabSizeIndex = target.selectedIndex;
  }

  @action selectedThemeIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedThemeIndex = target.selectedIndex;
  }

  @action selectedUnchangedMarginIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedUnchangedMarginIndex = target.selectedIndex;
  }

  @action selectedUnchangedMinSizeIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedUnchangedMinSizeIndex = target.selectedIndex;
  }
}
