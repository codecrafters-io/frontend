import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import EXAMPLE_DOCUMENTS, { ExampleDocument } from 'codecrafters-frontend/utils/code-mirror-documents';

const OPTION_DEFAULTS = {
  foldGutter: true,
  headerTooltipText: false,
  isCollapsed: false,
  isCollapsible: false,
  scrollIntoViewOnCollapse: true,
  selectedDocumentIndex: 1,
};

export default class DemoFileContentsCardController extends Controller {
  queryParams = ['foldGutter', 'headerTooltipText', 'isCollapsed', 'isCollapsible', 'scrollIntoViewOnCollapse', 'selectedDocumentIndex'];

  @tracked documents: ExampleDocument[] = EXAMPLE_DOCUMENTS;

  @tracked foldGutter: boolean = OPTION_DEFAULTS.foldGutter;
  @tracked headerTooltipText: boolean = OPTION_DEFAULTS.headerTooltipText;
  @tracked isCollapsed: boolean = OPTION_DEFAULTS.isCollapsed;
  @tracked isCollapsible: boolean = OPTION_DEFAULTS.isCollapsible;
  @tracked scrollIntoViewOnCollapse: boolean = OPTION_DEFAULTS.scrollIntoViewOnCollapse;
  @tracked selectedDocumentIndex: number = OPTION_DEFAULTS.selectedDocumentIndex;

  get selectedDocument() {
    return this.documents[this.selectedDocumentIndex] || ExampleDocument.createEmpty();
  }

  @action resetAllOptions() {
    Object.assign(this, OPTION_DEFAULTS);
  }

  @action selectedDocumentIndexDidChange(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedDocumentIndex = target.selectedIndex;
  }
}
