import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import EXAMPLE_DOCUMENTS, { DiffBasedExampleDocument } from 'codecrafters-frontend/utils/code-mirror-documents';

const OPTION_DEFAULTS = {
  forceDarkTheme: false,
  selectedDocumentIndex: 1,
};

export default class DemoFileDiffCardController extends Controller {
  @tracked documents: DiffBasedExampleDocument[] = EXAMPLE_DOCUMENTS;

  @tracked forceDarkTheme: boolean = OPTION_DEFAULTS.forceDarkTheme;
  @tracked selectedDocumentIndex: number = OPTION_DEFAULTS.selectedDocumentIndex;

  get selectedDocument() {
    return this.documents[this.selectedDocumentIndex] || DiffBasedExampleDocument.createEmpty();
  }

  @action resetAllOptions() {
    Object.assign(this, OPTION_DEFAULTS);
  }

  @action selectedDocumentIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedDocumentIndex = target.selectedIndex;
  }
}
