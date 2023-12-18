export default function scrollToTop(element = window) {
  if (element && typeof element.scrollTo === 'function') {
    element.scrollTo({ top: 0 });
  }
}
