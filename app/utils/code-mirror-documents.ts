import { tracked } from '@glimmer/tracking';
import { parseDiff } from 'codecrafters-frontend/helpers/diff-to-document';

export class ExampleDocument {
  @tracked document: string = '';
  @tracked originalDocument: string;
  @tracked filename: string;
  @tracked language: string;

  constructor({
    document = '',
    originalDocument,
    filename,
    language,
  }: {
    document?: string;
    originalDocument?: string;
    filename: string;
    language: string;
  }) {
    this.document = document;
    this.originalDocument = originalDocument || document;
    this.filename = filename;
    this.language = language;
  }

  static createEmpty() {
    return new this({ filename: 'empty.txt', language: 'text' });
  }
}

export class DiffBasedExampleDocument extends ExampleDocument {
  @tracked diff?: string;

  constructor({ diff, filename, language }: { diff?: string; filename: string; language: string }) {
    const { current: document, original: originalDocument } = parseDiff(diff);

    super({
      document,
      originalDocument,
      filename,
      language,
    });

    this.diff = diff;
  }
}

export default [
  new DiffBasedExampleDocument({
    diff: [
      ' An example plain-text document 1',
      ' An example plain-text document 2',
      ' An example plain-text document 3',
      ' An example plain-text document 4',
      ' An example plain-text document 5',
      ' An example plain-text document 6',
      ' An example plain-text document 7',
      '+An example plain-text document NEW LINE',
      ' An example plain-text document 8',
      ' An example plain-text document 9',
      '+NEW LINE',
      ' An example plain-text document 10',
      ' An example plain-text document 11',
      ' An example plain-text document 12',
      ' An example plain-text document 13',
      ' An example plain-text document 14',
      ' An example plain-text document 15',
      ' An example plain-text document 16',
      ' An example plain-text document 17',
      ' An example plain-text document 18',
      ' An example plain-text document 19',
      ' An example plain-text document 20',
      ' An example plain-text document 21',
      '+An example plain-text document NEW LINE',
      ' An example plain-text document 22',
      ' An example plain-text document 23',
      ' An example plain-text document 24',
      '-An example plain-text document 25',
      '+An example plain-text MODIFIED document 25',
      ' An example plain-text document 26',
      ' An example plain-text document 27',
      ' An example plain-text document 28',
      ' An example plain-text document 29',
      ' An example plain-text document 30',
      ' An example plain-text document 31',
      ' An example plain-text document 32',
      ' An example plain-text document 33',
      ' An example plain-text document 34',
      ' An example plain-text document 35',
      ' ',
    ].join('\n'),
    filename: 'test.txt',
    language: 'text',
  }),

  new DiffBasedExampleDocument({
    diff: [
      ' // Some comment',
      ' ',
      ' var x = function functionName() { return `test ${abc}`; };',
      ' ',
      '-/**',
      '- *Completely irrelevant comment',
      '-*/',
      '-',
      '-const SOME_CONSTANT = "A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. ";',
      '+const LONG_CONSTANT = "A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. A very long constant. ";',
      ' ',
      ' /**',
      '- * Un-useful comment about method foo()',
      '- * More information about the method',
      '+ * Useful comment about method foo()',
      '+ * Six trailing whitespaces:      ',
      '+ * Two TAB charachers: \t\t ≪—— here',
      '+ * Three trailing TAB charachers: \t\t\t',
      '+ * Four invisible characters: ——≫ ‎‎‎‎ ≪—— here',
      ' */',
      ' ',
      ' async function foo() {',
      '   var x = 1;',
      '-  alert("123" + x);',
      "+  alert('123' + x);",
      ' }',
      ' ',
      ' async function fooTwo() {',
      '   var x = 1;',
      '-  alert("123" + x);',
      "+  alert('123' + x);",
      ' }',
      ' ',
      ' async function fooThree() {',
      '   var x = 1;',
      '-  alert("123" + x);',
      "+  alert('123' + x);",
      ' }',
      ' ',
    ].join('\n'),
    filename: 'test.js',
    language: 'javascript',
  }),

  new DiffBasedExampleDocument({
    diff: [
      '-<html><body>An example HTML document</body></html>',
      '+<html>',
      '+\t<head>',
      '+\t\t<link rel="icon" href="/assets/favicon.ico" />',
      '+\t</head>',
      '+\t<body class="main-body" onblur="function doSomething(param1, param2) { return [param + param2]; }">',
      '+\t\t<span aria-disabled style="height: 100px; color: greenyellow; font-weight: bold">',
      '+\t\t\t&nbsp;',
      '+\t\t</span>',
      '+\t\tAn example HTML document',
      '+\t\tWith an invisible  ——≫ ‎ ≪——  characer',
      '+\t</body>',
      '+</html>',
    ].join('\n'),
    filename: 'test.html',
    language: 'html',
  }),

  new DiffBasedExampleDocument({
    diff: [
      ' # Assign a numeric value',
      ' number = 70',
      ' ',
      '-# Check the is more than 70 or not',
      '+# Check the value is more than 70 or not',
      ' if (number >= 70):',
      '-\tprint("They have passed")',
      '+\tprint("You have passed")',
      ' else:',
      '-\tprint("They have not passed")',
      '+\tprint("You have not passed")',
      ' ',
    ].join('\n'),
    filename: 'test.py',
    language: 'python',
  }),

  new DiffBasedExampleDocument({
    diff: [
      ' -- Table: customer',
      ' CREATE TABLE customer (',
      ' \tid int  NOT NULL IDENTITY(1, 1),',
      ' \tcustomer_name varchar(255)  NOT NULL,',
      ' \tcity_id int  NOT NULL,',
      ' \tcustomer_address varchar(255)  NOT NULL,',
      ' \tnext_call_date date  NULL,',
      ' \tts_inserted datetime  NOT NULL,',
      ' \tCONSTRAINT customer_pk PRIMARY KEY  (id)',
      ' );',
      ' ',
      '--- Table: customer_backup',
      '-CREATE TABLE customer_backup (',
      '-\tid int  NOT NULL IDENTITY(1, 1),',
      '-\tcustomer_name varchar(255)  NOT NULL,',
      '-\tcity_id int  NOT NULL,',
      '-\tcustomer_address varchar(255)  NOT NULL,',
      '-\tnext_call_date date  NULL,',
      '-\tts_inserted datetime  NOT NULL,',
      '-\tCONSTRAINT customer_pk PRIMARY KEY  (id)',
      '-);',
      '-',
      ' -- Table: customer_backup3',
      ' CREATE TABLE customer_backup3 (',
      ' \tid int  NOT NULL IDENTITY(1, 1),',
      ' \tcustomer_name varchar(255)  NOT NULL,',
      ' \tcity_id int  NOT NULL,',
      ' \tcustomer_address varchar(255)  NOT NULL,',
      ' \tnext_call_date date  NULL,',
      ' \tts_inserted datetime  NOT NULL,',
      ' \tCONSTRAINT customer_pk PRIMARY KEY  (id)',
      ' );',
      ' ',
      '+-- Extra comment',
      '+-- Extra comment',
      '+-- Extra comment',
      '+-- Extra comment',
      '+-- Extra comment',
      '+',
      ' -- Unchanged comment',
      ' -- Unchanged comment',
      ' -- Unchanged comment',
      ' -- Unchanged comment',
      ' -- Unchanged comment',
      ' ',
      ' -- Unchanged comment',
      ' -- Unchanged comment',
      ' -- Unchanged comment',
      ' -- Unchanged comment',
      ' -- Unchanged comment',
      ' ',
    ].join('\n'),
    filename: 'test.sql',
    language: 'sql',
  }),

  new DiffBasedExampleDocument({
    diff: [
      '-### Example Markdown document',
      '+# Example Markdown document',
      '+### Another header',
      '+###### Another header',
      '+-----------',
      '+__Bold text__',
      '+_Italic text_',
      '+',
      '+This in a example document with code snippets',
      '+',
      '+```ts',
      "+function myTestFunction({ world = 'world' } : { world!: string } = {}) {",
      '+  return window.confirm(`Hello ${world}!`)',
      '+}',
      '+```',
      '+',
      '+```html',
      '+<body>',
      '+  <head></head>',
      '+</body>',
      '+```',
      ' ',
    ].join('\n'),
    filename: 'test.md',
    language: 'markdown',
  }),

  new DiffBasedExampleDocument({
    diff: [
      ' # syntax=docker/dockerfile:1.7-labs',
      ' FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine',
      ' ',
      '+WORKDIR /app',
      '+',
      '+# .git & README.md are unique per-repository. We ignore them on first copy to prevent cache misses',
      '+COPY --exclude=.git --exclude=README.md . /app',
      '+',
      '+# This saves nuget packages to ~/.nuget',
      '+RUN dotnet build --configuration Release .',
      '+',
      '+# This seems to cause a caching issue with the dotnet build command, where old contents are used',
      '+# TODO: See if this needs to be brought back?',
      '+# RUN rm -rf /app/obj',
      '+# RUN rm -rf /app/bin',
      '+',
      '+RUN echo "cd \\${CODECRAFTERS_SUBMISSION_DIR} && dotnet build --configuration Release ." > /codecrafters-precompile.sh',
      '+RUN chmod +x /codecrafters-precompile.sh',
      '+',
      '+ENV CODECRAFTERS_DEPENDENCY_FILE_PATHS="codecrafters-redis.csproj,codecrafters-redis.sln"',
      '+',
      '+# Once the heavy steps are done, we can copy all files back',
      '+COPY . /app',
      '+',
      ' ',
    ].join('\n'),
    filename: 'Dockerfile',
    language: 'dockerfile',
  }),
];
