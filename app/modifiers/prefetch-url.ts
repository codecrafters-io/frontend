// Prefetches a URL by injecting a <link rel="prefetch"> element into the document head.
// This allows the browser to fetch the resource in the background, improving load times
// when the user navigates to the URL.
//
// Usage: <a href={{url}} {{prefetch-url url}}></a>
import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

interface Signature {
  Args: {
    Positional: [string | undefined];
  };
}

function cleanup(instance: PrefetchUrlModifier) {
  if (instance.linkElement && instance.linkElement.parentNode) {
    instance.linkElement.parentNode.removeChild(instance.linkElement);
  }

  instance.linkElement = null;
}

export default class PrefetchUrlModifier extends Modifier<Signature> {
  linkElement: HTMLLinkElement | null = null;

  modify(_element: Element, [url]: [string | undefined]) {
    cleanup(this); // Remove any previous link element

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
    'prefetch-url': typeof PrefetchUrlModifier;
  }
}
