import config from 'codecrafters-frontend/config/environment';

type ScrollableElement = {
  scrollTo?: (options: ScrollToOptions) => void;
};

export default function scrollToTop(element?: ScrollableElement | null) {
  const target = element ?? (typeof window !== 'undefined' ? (window as ScrollableElement) : null);

  if (target && typeof target.scrollTo === 'function') {
    target.scrollTo({ top: 0 });

    if (typeof window !== 'undefined' && target === window && config.environment === 'test' && typeof document !== 'undefined') {
      document.getElementById('ember-testing-container')?.scrollTo({ top: 0 });
    }
  }
}
