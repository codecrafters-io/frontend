import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import { type Extension } from '@codemirror/state';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';

const THEME_EXTENSIONS: {
  [key: string]: Extension;
} = {
  githubDark,
  githubLight,
};

const SUPPORTED_THEMES = Object.keys(THEME_EXTENSIONS).filter((key) => !(key.startsWith('defaultSettings') || key.endsWith('Init')));
const DEFAULT_THEME = 'githubDark';

class ExampleDocument {
  @tracked document!: string;
  @tracked originalDocument!: string;
  @tracked filename!: string;
  @tracked language!: string;
  constructor({
    document,
    originalDocument,
    filename,
    language,
  }: {
    document: string;
    originalDocument?: string;
    filename: string;
    language: string;
  }) {
    this.document = document;
    this.originalDocument = originalDocument || document;
    this.filename = filename;
    this.language = language;
  }
}

export default class DemoCodeMirrorController extends Controller {
  @tracked placeholderMessage = 'Welcome to CodeCrafters test zone for CodeMirror! Start editing the document here...';

  @tracked documents: ExampleDocument[] = [
    new ExampleDocument({
      document: 'An example plain-text document',
      filename: 'test.txt',
      language: 'text',
    }),
    new ExampleDocument({
      document:
        "// Some comment\n\nvar x = function functionName() { return `test ${abc}`; };\n\nconst LONG_CONSTANT = \"A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. \";\n\n/**\n * Useful comment about method foo()\n * Some trailing whitespace:      \n * Tab charachers: \t\t\t ≪—— here\n * Some invisible characters: ‎‎‎ ≪—— here\n*/\n\nasync function foo() {\n  var x = 1;\n  alert('123' + x);\n}\n\nasync function fooTwo() {\n  var x = 1;\n  alert('123' + x);\n}\n\nasync function fooThree() {\n  var x = 1;\n  alert('123' + x);\n}\n",
      originalDocument:
        '// Some comment\n\nvar x = function functionName() { return `test ${abc}`; };\n\n/**\n *Completely irrelevant comment\n*/\n\nconst SOME_CONSTANT = "A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. ";\n\n/**\n * Un-useful comment about method foo()\n * More information about the method\n*/\n\nasync function foo() {\n  var x = 1;\n  alert("123" + x);\n}\n\nasync function fooTwo() {\n  var x = 1;\n  alert("123" + x);\n}\n\nasync function fooThree() {\n  var x = 1;\n  alert("123" + x);\n}\n',
      filename: 'test.js',
      language: 'javascript',
    }),
    new ExampleDocument({
      document: '<html>\n\t<body>\n\t\tAn example HTML document\n\t\tWith an invisible  -> ‎ <-  characer\n\t</body>\n</html>',
      originalDocument: '<html><body>An example HTML document</body></html>',
      filename: 'test.html',
      language: 'html',
    }),
    new ExampleDocument({
      document:
        '# Assign a numeric value\nnumber = 70\n\n# Check the value is more than 70 or not\nif (number >= 70):\n\tprint("You have passed")\nelse:\n\tprint("You have not passed")',
      originalDocument:
        '# Assign a numeric value\nnumber = 70\n\n# Check the is more than 70 or not\nif (number >= 70):\n\tprint("They have passed")\nelse:\n\tprint("They have not passed")',
      filename: 'test.py',
      language: 'python',
    }),
    new ExampleDocument({
      document:
        '-- Table: customer\nCREATE TABLE customer (\n\tid int  NOT NULL IDENTITY(1, 1),\n\tcustomer_name varchar(255)  NOT NULL,\n\tcity_id int  NOT NULL,\n\tcustomer_address varchar(255)  NOT NULL,\n\tnext_call_date date  NULL,\n\tts_inserted datetime  NOT NULL,\n\tCONSTRAINT customer_pk PRIMARY KEY  (id)\n);',
      filename: 'test.sql',
      language: 'sql',
    }),
    new ExampleDocument({
      document:
        "# Example Markdown document\n### Another header\n###### Another header\n-----------\n__Bold text__\n_Italic text_\n\nThis in a example document with code snippets\n\n```ts\nfunction myTestFunction({ world = 'world' } : { world!: string } = {}) {\n  return window.confirm(`Hello ${world}!`)\n}\n```\n\n```html\n<body>\n  <head></head>\n</body>\n```",
      originalDocument: '### Example Markdown document',
      filename: 'test.md',
      language: 'markdown',
    }),
  ];

  @tracked indentUnits = [
    { name: 'Tab', symbol: '\t' },
    { name: '2 Spaces', symbol: '  ' },
    { name: '4 Spaces', symbol: '    ' },
  ];

  @tracked lineSeparators = [
    { name: '\\r\\n', symbol: '\r\n' },
    { name: '\\n', symbol: '\n' },
    { name: '\\r', symbol: '\r' },
  ];

  @tracked tabSizes = [1, 2, 4, 6, 8, 10, 12, 16];

  @tracked themes = SUPPORTED_THEMES;

  @tracked selectedDocumentIndex: number = 1;
  @tracked selectedIndentUnitIndex: number = 1;
  @tracked selectedLineSeparatorIndex: number = 1;
  @tracked selectedTabSizeIndex: number = 2;
  @tracked selectedThemeIndex: number = SUPPORTED_THEMES.indexOf(DEFAULT_THEME);

  get selectedDocument() {
    return this.documents[this.selectedDocumentIndex];
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
    return this.themes[this.selectedThemeIndex];
  }

  @tracked border: boolean = true;

  @tracked allowMultipleSelections: boolean = true;
  @tracked autocompletion: boolean = true;
  @tracked bracketMatching: boolean = true;
  @tracked closeBrackets: boolean = true;
  @tracked crosshairCursor: boolean = true;
  @tracked document: boolean = true;
  @tracked drawSelection: boolean = true;
  @tracked dropCursor: boolean = true;
  @tracked editable: boolean = true;
  @tracked filename: boolean = true;
  @tracked foldGutter: boolean = true;
  @tracked highlightActiveLine: boolean = true;
  @tracked highlightSelectionMatches: boolean = true;
  @tracked highlightSpecialChars: boolean = true;
  @tracked highlightTrailingWhitespace: boolean = true;
  @tracked highlightWhitespace: boolean = true;
  @tracked history: boolean = true;
  @tracked indentOnInput: boolean = true;
  @tracked indentUnit: boolean = true;
  @tracked indentWithTab: boolean = true;
  @tracked language: boolean = true;
  @tracked lineNumbers: boolean = true;
  @tracked lineSeparator: boolean = true;
  @tracked lineWrapping: boolean = true;
  @tracked mergeControls: boolean = true;
  @tracked originalDocument: boolean = false;
  @tracked placeholder: boolean = true;
  @tracked preserveHistory: boolean = false;
  @tracked readOnly: boolean = false;
  @tracked rectangularSelection: boolean = true;
  @tracked scrollPastEnd: boolean = false;
  @tracked syntaxHighlighting: boolean = true;
  @tracked tabSize: boolean = true;
  @tracked theme: boolean = false;

  @action documentDidChange(_target: Controller, newValue: string) {
    if (!this.document) {
      return; // Don't overwrite the document if it's not being passed!
    }

    if (this.selectedDocument?.document !== newValue) {
      this.selectedDocument!.document = newValue;
    }
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
}
