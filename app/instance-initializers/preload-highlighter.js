import SyntaxHighlightedDiffComponent from '../components/syntax-highlighted-diff';

export function initialize() {
  SyntaxHighlightedDiffComponent.preloadHighlighter();
}

export default {
  initialize,
};
