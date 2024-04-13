import Component from '@glimmer/component';
import { action } from '@ember/object';

import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState, Compartment } from '@codemirror/state';
import {
  gutter as gutterRS,
  GutterMarker as GutterMarkerRS,
  lineNumbers as lineNumbersRS,
  highlightActiveLineGutter as highlightActiveLineGutterRS,
} from 'codecrafters-frontend/utils/codemirror-gutter-rs';

function getRandomInt(inclusiveMin, exclusiveMax) {
  const minCeiled = Math.ceil(inclusiveMin);
  const maxFloored = Math.floor(exclusiveMax);

  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function smartLineMarker(view, line) {
  const lineNumber = view.state.doc.lineAt(line.from).number;

  if (lineNumber % 3 !== 0) {
    return new CommentButtonGutterMarker(lineNumber);
  }

  return new CommentsCountGutterMarker(lineNumber, getRandomInt(1, 11));
}

class CommentsCountGutterMarker extends GutterMarkerRS {
  lineNumber = 0;
  commentsCount = 0;

  constructor(lineNumber, commentsCount) {
    super();
    this.lineNumber = lineNumber;
    this.commentsCount = commentsCount;
  }

  toDOM() {
    const numbersMap = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    return document.createTextNode(`${numbersMap[this.commentsCount] || this.commentsCount}`);
  }
}

class CommentButtonGutterMarker extends GutterMarkerRS {
  lineNumber = 0;

  constructor(lineNumber) {
    super();
    this.lineNumber = lineNumber;
  }

  toDOM() {
    const elem = document.createElement('comment-button');
    elem.innerText = `💬`;

    return elem;
  }
}

export default class CodeMirrorComponent extends Component {
  editableCompartment = new Compartment();
  readOnlyCompartment = new Compartment();

  renderedView;

  @action
  renderEditor(element) {
    const extensions = [
      basicSetup,
      javascript(),
      gutterRS({
        class: 'cm-custom-gutter-rs',
        renderEmptyElements: true,
        lineMarker: smartLineMarker,
      }),
      lineNumbersRS(),
      highlightActiveLineGutterRS(),
      this.editableCompartment.of(EditorView.editable.of(!this.args.readOnly)),
      this.readOnlyCompartment.of(EditorState.readOnly.of(this.args.readOnly)),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && typeof this.args.onUpdate == 'function') {
          this.args.onUpdate(update.state.doc.toString());
        }
      }),
    ];

    this.renderedView = new EditorView({
      doc: this.args.document,
      extensions,
      parent: element,
    });
  }

  @action updateDocument(element, [newValue]) {
    const documentChanged = this.renderedView.state.doc.toString() !== newValue;

    if (!documentChanged) {
      return;
    }

    const transaction = this.renderedView.state.update({
      changes: {
        from: 0,
        to: this.renderedView.state.doc.length,
        insert: newValue,
      },
    });

    if (transaction) {
      this.renderedView.dispatch(transaction);
    }
  }

  @action updateReadOnly() {
    this.renderedView.dispatch({
      effects: [
        this.editableCompartment.reconfigure(EditorView.editable.of(!this.args.readOnly)),
        this.readOnlyCompartment.reconfigure(EditorState.readOnly.of(this.args.readOnly)),
      ],
    });
  }
}
