import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    value: string;
    onUpdate: (newValue: string) => void | Promise<void>;
    errorMessage?: string;
  };

  Blocks: {
    default: [];
  };
}

export default class EditableTextField extends Component<Signature> {
  @tracked isEditing = false;
  @tracked editingValue = '';

  get shouldShowEditMode() {
    return this.isEditing || !!this.args.errorMessage;
  }

  @action
  handleCancel() {
    this.editingValue = this.args.value;
    this.isEditing = false;
  }

  @action
  handleDisplayClick() {
    this.editingValue = this.args.value;
    this.isEditing = true;
  }

  @action
  handleInput(event: Event) {
    this.editingValue = (event.target as HTMLInputElement).value;
  }

  @action
  handleUpdate() {
    this.args.onUpdate(this.editingValue);
    this.isEditing = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    EditableTextField: typeof EditableTextField;
  }
}
