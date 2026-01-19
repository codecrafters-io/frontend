import config from 'codecrafters-frontend/config/environment';

export default function scrollToTop(element = window) {
  if (element && typeof element.scrollTo === 'function') {
    element.scrollTo({ top: 0 });

    if (element === window && config.environment === 'test') {
      document.getElementById('ember-testing-container')?.scrollTo({ top: 0 });
    }
  }
}
