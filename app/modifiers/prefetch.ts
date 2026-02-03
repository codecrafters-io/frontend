// Prefetches a URL by injecting a <link rel="prefetch"> element into the document head.
// This allows the browser to fetch the resource in the background, improving load times
// when the user navigates to the URL.
//
// The URL is automatically extracted from the element's href attribute.
// Usage: <a href={{url}} {{prefetch}}></a>
import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

interface Signature {
  Element: HTMLAnchorElement;
}

function cleanup(instance: PrefetchModifier) {
  if (instance.linkElement && instance.linkElement.parentNode) {
    instance.linkElement.parentNode.removeChild(instance.linkElement);
  }

  instance.linkElement = null;
}

export default class PrefetchModifier extends Modifier<Signature> {
  linkElement: HTMLLinkElement | null = null;

  modify(element: HTMLAnchorElement) {
    cleanup(this); // Remove any previous link element

    const url = element.href;

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

    registerDestructor(this, cleanup);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    prefetch: typeof PrefetchModifier;
  }
}
