import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { run } from '@ember/runloop';

// @ts-ignore
import networkingProtocolsLayers from '/assets/concept-animations/network-protocols/layers.lottie.json';
// @ts-ignore
import networkingProtocolsLayersWithExamples from '/assets/concept-animations/network-protocols/layers-with-examples.lottie.json';
// @ts-ignore
import networkingProtocolsLayer1 from '/assets/concept-animations/network-protocols/layer-1.lottie.json';
// @ts-ignore
import networkingProtocolsLayer2 from '/assets/concept-animations/network-protocols/layer-2.lottie.json';
// @ts-ignore
import networkingProtocolsLayer3 from '/assets/concept-animations/network-protocols/layer-3.lottie.json';
// @ts-ignore
import networkingProtocolsLayer4 from '/assets/concept-animations/network-protocols/layer-4.lottie.json';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: {
      conceptAnimationSlug: string;
    };
  };
}

export default class ConceptAnimationBlockComponent extends Component<Signature> {
  @service declare store: Store;
  animation?: AnimationItem;
  @tracked isPlayed = false;
  @tracked isLoaded = false;

  get animationFileUrl() {
    return {
      'network-protocols/layers': networkingProtocolsLayers,
      'network-protocols/layers-with-examples': networkingProtocolsLayersWithExamples,
      'network-protocols/layer-1': networkingProtocolsLayer1,
      'network-protocols/layer-2': networkingProtocolsLayer2,
      'network-protocols/layer-3': networkingProtocolsLayer3,
      'network-protocols/layer-4': networkingProtocolsLayer4,
    }[this.args.model.conceptAnimationSlug];
  }

  @action
  handleDidInsertContainer(element: HTMLDivElement) {
    this.animation = lottie.loadAnimation({
      container: element, // the dom element that will contain the animation
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: this.animationFileUrl, // the path to the animation json
    });

    this.animation.addEventListener('DOMLoaded', () => {
      run(() => {
        this.isLoaded = true;
      });
    });
  }

  @action
  handleDidEnterViewport() {
    if (!this.isPlayed && this.animation) {
      this.animation.play();
      this.isPlayed = true;
    }
  }
}
