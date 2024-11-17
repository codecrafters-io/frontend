import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import EXAMPLE_DOCUMENTS, { ExampleDocument } from 'codecrafters-frontend/utils/code-mirror-documents';

export default class DemoFileContentsCardController extends Controller {
  @tracked documents: ExampleDocument[] = EXAMPLE_DOCUMENTS;

  @tracked selectedDocumentIndex: number = 1;

  get selectedDocument() {
    return this.documents[this.selectedDocumentIndex] || ExampleDocument.createEmpty();
  }

  @tracked isCollapsible: boolean = false;
  @tracked isCollapsed: boolean = false;
  @tracked scrollIntoViewOnCollapse: boolean = true;
  @tracked headerTooltipText: boolean = false;
  @tracked foldGutter: boolean = true;

  @action selectedDocumentIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedDocumentIndex = target.selectedIndex;
  }
}
