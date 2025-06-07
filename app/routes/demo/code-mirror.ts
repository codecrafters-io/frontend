import Route from '@ember/routing/route';

const QUERY_PARAMS = [
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

interface QueryParamOptions {
  [key: string]: {
    replace: boolean;
  };
}

export default class DemoCodeMirrorRoute extends Route {
  queryParams = QUERY_PARAMS.reduce<QueryParamOptions>((acc, param) => {
    acc[param] = { replace: true };

    return acc;
  }, {});
}
