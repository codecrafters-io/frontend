import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { type Extension } from '@codemirror/state';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import { codeCraftersDark, codeCraftersLight } from 'codecrafters-frontend/utils/code-mirror-themes';

const THEME_EXTENSIONS: {
  [key: string]: Extension;
} = {
  codeCraftersLight,
  codeCraftersDark,
};

const SUPPORTED_THEMES = [...Object.keys(THEME_EXTENSIONS), 'codeCraftersAuto'];
const DEFAULT_THEME = 'codeCraftersAuto';

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
  @service declare darkMode: DarkModeService;

  @tracked placeholderMessage = 'Welcome to CodeCrafters test zone for CodeMirror! Start editing the document here...';

  @tracked documents: ExampleDocument[] = [
    new ExampleDocument({
      document:
        'An example plain-text document 1\nAn example plain-text document 2\nAn example plain-text document 3\nAn example plain-text document 4\nAn example plain-text document 5\nAn example plain-text document 6\nAn example plain-text document 7\nAn example plain-text document 8\nAn example plain-text document 9\nAn example plain-text modified document 10\nAn example plain-text document 11\nAn example plain-text document 12\nAn example plain-text document 13\nAn example plain-text document 14\nAn example plain-text document 15\nAn example plain-text document 16\nAn example plain-text document 17\nAn example plain-text document 18\nAn example plain-text document 19',
      originalDocument:
        'An example plain-text document 1\nAn example plain-text document 2\nAn example plain-text document 3\nAn example plain-text document 4\nAn example plain-text document 5\nAn example plain-text document 6\nAn example plain-text document 7\nAn example plain-text document 8\nAn example plain-text document 9\nAn example plain-text document 10\nAn example plain-text document 11\nAn example plain-text document 12\nAn example plain-text document 13\nAn example plain-text document 14\nAn example plain-text document 15\nAn example plain-text document 16\nAn example plain-text document 17\nAn example plain-text document 18\nAn example plain-text document 19',
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
    new ExampleDocument({
      document:
        '# syntax=docker/dockerfile:1.7-labs\nFROM mcr.microsoft.com/dotnet/sdk:8.0-alpine\n\nWORKDIR /app\n\n# .git & README.md are unique per-repository. We ignore them on first copy to prevent cache misses\nCOPY --exclude=.git --exclude=README.md . /app\n\n# This saves nuget packages to ~/.nuget\nRUN dotnet build --configuration Release .\n\n# This seems to cause a caching issue with the dotnet build command, where old contents are used\n# TODO: See if this needs to be brought back?\n# RUN rm -rf /app/obj\n# RUN rm -rf /app/bin\n\nRUN echo "cd \\${CODECRAFTERS_SUBMISSION_DIR} && dotnet build --configuration Release ." > /codecrafters-precompile.sh\nRUN chmod +x /codecrafters-precompile.sh\n\nENV CODECRAFTERS_DEPENDENCY_FILE_PATHS="codecrafters-redis.csproj,codecrafters-redis.sln"\n\n# Once the heavy steps are done, we can copy all files back\nCOPY . /app\n\n',
      originalDocument: '# syntax=docker/dockerfile:1.7-labs\n',
      filename: 'Dockerfile',
      language: 'dockerfile',
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

  @tracked themes = [...SUPPORTED_THEMES];

  @tracked selectedDocumentIndex: number = 1;
  @tracked selectedIndentUnitIndex: number = 1;
  @tracked selectedLineSeparatorIndex: number = 1;
  @tracked selectedTabSizeIndex: number = 2;
  @tracked selectedThemeIndex: number = this.themes.indexOf(DEFAULT_THEME);

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

  @tracked outline: boolean = true;

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
  @tracked collapseUnchanged: boolean = true;
  @tracked originalDocument: boolean = false;
  @tracked placeholder: boolean = true;
  @tracked preserveHistory: boolean = false;
  @tracked readOnly: boolean = false;
  @tracked rectangularSelection: boolean = true;
  @tracked scrollPastEnd: boolean = false;
  @tracked syntaxHighlighting: boolean = true;
  @tracked tabSize: boolean = true;
  @tracked theme: boolean = true;

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
