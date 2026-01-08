import config from 'codecrafters-frontend/config/environment';

type ScrollableElement = Window | Element;

export default function scrollToTop(element: ScrollableElement = window): void {
  if (element && typeof element.scrollTo === 'function') {
    element.scrollTo({ top: 0 });

    if (element === window && config.environment === 'test') {
      document.getElementById('ember-testing-container')?.scrollTo({ top: 0 });
    }
  }
}
