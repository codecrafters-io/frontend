import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import EXAMPLE_DOCUMENTS, { ExampleDocument } from 'codecrafters-frontend/utils/code-mirror-documents';

const OPTION_DEFAULTS = {
  collapsedRanges: false,
  headerTooltipText: false,
  highlightedRanges: false,
  isCollapsed: false,
  isCollapsible: false,
  scrollIntoViewOnCollapse: true,
  selectedDocumentIndex: 1,
};

export default class DemoFileContentsCardController extends Controller {
  queryParams = ['headerTooltipText', 'isCollapsed', 'isCollapsible', 'scrollIntoViewOnCollapse', 'selectedDocumentIndex'];

  @tracked documents: ExampleDocument[] = EXAMPLE_DOCUMENTS;

  @tracked collapsedRanges: boolean = OPTION_DEFAULTS.collapsedRanges;
  @tracked headerTooltipText: boolean = OPTION_DEFAULTS.headerTooltipText;
  @tracked highlightedRanges: boolean = OPTION_DEFAULTS.highlightedRanges;
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
