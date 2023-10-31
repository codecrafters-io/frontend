export default function scrollToTop(element = window, behavior = 'auto') {
  if (element && typeof element.scrollTo === 'function') {
    element.scrollTo({ top: 0, behavior });
  }
}
