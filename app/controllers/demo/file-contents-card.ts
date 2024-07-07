import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

class ExampleDocument {
  @tracked document: string;
  @tracked filename: string;
  @tracked language: string;
  constructor({ document, filename, language }: { document: string; filename: string; language: string }) {
    this.document = document;
    this.filename = filename;
    this.language = language;
  }
}

export default class DemoFileContentsCardController extends Controller {
  @tracked documents: ExampleDocument[] = [
    new ExampleDocument({
      document: 'An example plain-text document',
      filename: 'test.txt',
      language: 'text',
    }),
    new ExampleDocument({
      document:
        "// Some comment\n\nvar x = function functionName() { return `test ${abc}`; };\n\nconst LONG_CONSTANT = \"A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. \";\n\n/**\n * Useful comment about method foo()\n * Some trailing whitespace:      \n * Tab charachers: \t\t\t ≪—— here\n * Some invisible characters: ‎‎‎ ≪—— here\n*/\n\nasync function foo() {\n  var x = 1;\n  alert('123' + x);\n}\n\nasync function fooTwo() {\n  var x = 1;\n  alert('123' + x);\n}\n\nasync function fooThree() {\n  var x = 1;\n  alert('123' + x);\n}\n",
      filename: 'test.js',
      language: 'javascript',
    }),
    new ExampleDocument({
      document: '<html>\n\t<body>\n\t\tAn example HTML document\n\t\tWith an invisible  -> ‎ <-  characer\n\t</body>\n</html>',
      filename: 'test.html',
      language: 'html',
    }),
    new ExampleDocument({
      document:
        '# Assign a numeric value\nnumber = 70\n\n# Check the value is more than 70 or not\nif (number >= 70):\n\tprint("You have passed")\nelse:\n\tprint("You have not passed")',
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
      filename: 'test.md',
      language: 'markdown',
    }),
    new ExampleDocument({
      document:
        '# syntax=docker/dockerfile:1.7-labs\nFROM mcr.microsoft.com/dotnet/sdk:8.0-alpine\n\nWORKDIR /app\n\n# .git & README.md are unique per-repository. We ignore them on first copy to prevent cache misses\nCOPY --exclude=.git --exclude=README.md . /app\n\n# This saves nuget packages to ~/.nuget\nRUN dotnet build --configuration Release .\n\n# This seems to cause a caching issue with the dotnet build command, where old contents are used\n# TODO: See if this needs to be brought back?\n# RUN rm -rf /app/obj\n# RUN rm -rf /app/bin\n\nRUN echo "cd \\${CODECRAFTERS_SUBMISSION_DIR} && dotnet build --configuration Release ." > /codecrafters-precompile.sh\nRUN chmod +x /codecrafters-precompile.sh\n\nENV CODECRAFTERS_DEPENDENCY_FILE_PATHS="codecrafters-redis.csproj,codecrafters-redis.sln"\n\n# Once the heavy steps are done, we can copy all files back\nCOPY . /app\n\n',
      filename: 'Dockerfile',
      language: 'dockerfile',
    }),
  ];

  @tracked selectedDocumentIndex: number = 1;

  get selectedDocument() {
    return this.documents[this.selectedDocumentIndex] || new ExampleDocument({ document: '', filename: 'unknown.txt', language: 'text' });
  }

  @tracked isCollapsible: boolean = false;
  @tracked isCollapsed: boolean = false;
  @tracked scrollIntoViewOnCollapse: boolean = true;
  @tracked headerTooltipText: boolean = false;

  @action selectedDocumentIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedDocumentIndex = target.selectedIndex;
  }
}
