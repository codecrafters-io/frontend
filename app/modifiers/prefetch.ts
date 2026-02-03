// Prefetches a URL by injecting a <link rel="prefetch"> element into the document head.
// This allows the browser to fetch the resource in the background, improving load times
// when the user navigates to the URL.
//
// The URL is automatically extracted from the element's href attribute.
// Watches for href changes using MutationObserver and updates the prefetch link accordingly.
// Usage: <a href={{url}} {{prefetch}}></a>
import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

interface Signature {
  Element: HTMLAnchorElement;
}

function cleanup(instance: PrefetchModifier) {
  if (instance.observer) {
    instance.observer.disconnect();
    instance.observer = null;
  }

  if (instance.linkElement && instance.linkElement.parentNode) {
    instance.linkElement.parentNode.removeChild(instance.linkElement);
  }

  instance.linkElement = null;
}

export default class PrefetchModifier extends Modifier<Signature> {
  linkElement: HTMLLinkElement | null = null;
  observer: MutationObserver | null = null;

  modify(element: HTMLAnchorElement) {
    cleanup(this); // Remove any previous link element and observer

    this.updatePrefetchLink(element.href);

    // Watch for changes to the href attribute
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
          this.updatePrefetchLink((mutation.target as HTMLAnchorElement).href);
        }
      }
    });

    this.observer.observe(element, { attributes: true, attributeFilter: ['href'] });

    registerDestructor(this, cleanup);
  }

  updatePrefetchLink(url: string | undefined) {
    // Remove existing link element if present
    if (this.linkElement && this.linkElement.parentNode) {
      this.linkElement.parentNode.removeChild(this.linkElement);
      this.linkElement = null;
    }

    if (!url) {
      return;
    }

    // Create a prefetch link element
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';

    // Append to document head
    document.head.appendChild(link);
    this.linkElement = link;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    prefetch: typeof PrefetchModifier;
  }
}
