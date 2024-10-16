import Route from '@ember/routing/route';

const QUERY_PARAMS = [
  'allowMultipleSelections',
  'autocompletion',
  'bracketMatching',
  'closeBrackets',
  'collapseUnchanged',
  'crosshairCursor',
  'document',
  'drawSelection',
  'dropCursor',
  'editable',
  'filename',
  'foldGutter',
  'highlightActiveLine',
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
  'syntaxHighlighting',
  'tabSize',
  'theme',
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
