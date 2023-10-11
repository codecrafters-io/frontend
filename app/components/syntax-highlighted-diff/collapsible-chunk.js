import Component from '@glimmer/component';
import { action } from '@ember/object';
import { groupBy } from 'codecrafters-frontend/lib/lodash-utils';
import { tracked } from '@glimmer/tracking';

export default class CollapsibleChunkComponent extends Component {
  @tracked isCollapsed = this.args.chunk.isCollapsed;
  @tracked lineNumberWithExpandedComments = null;

  get topLevelCommentsGroupedByLine() {
    return groupBy(this.args.comments || [], (comment) => comment.subtargetEndLine || 0);
  }

  @action
  handleClick() {
    this.isCollapsed = !this.isCollapsed;
  }

  @action
  handleToggleCommentsButtonClick(lineNumber) {
    if (this.lineNumberWithExpandedComments === lineNumber) {
      this.lineNumberWithExpandedComments = null;
    } else {
      this.lineNumberWithExpandedComments = lineNumber;

      (this.topLevelCommentsGroupedByLine[lineNumber] || []).forEach((comment) => {
        this.args.onCommentView && this.args.onCommentView(comment);
      });
    }
  }
}
