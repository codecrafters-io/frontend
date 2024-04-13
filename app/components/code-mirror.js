import Component from '@glimmer/component';
import { action } from '@ember/object';

import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState, Compartment } from '@codemirror/state';

export default class CodeMirrorComponent extends Component {
  editableCompartment = new Compartment();
  readOnlyCompartment = new Compartment();

  renderedView;

  @action
  renderEditor(element) {
    const extensions = [
      basicSetup,
      javascript(),
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
