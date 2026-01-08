import SyntaxHighlightedDiff from '../components/syntax-highlighted-diff';

export function initialize() {
  SyntaxHighlightedDiff.preloadHighlighter();
}

export default {
  initialize,
};
