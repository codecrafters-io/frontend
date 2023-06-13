import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// @ts-ignore
import networkingProtocolsIntroData from '/assets/concept-animations/networking-protocols/intro.json';

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

  get animationFileData() {
    return {
      'networking-protocols/intro': networkingProtocolsIntroData,
    }[this.args.model.conceptAnimationSlug];
  }

  @action
  handleDidInsertContainer(element: HTMLDivElement) {
    this.animation = lottie.loadAnimation({
      container: element, // the dom element that will contain the animation
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: this.animationFileData, // the path to the animation json
      // path: this.animationFileUrl, // the path to the animation json
    });
  }

  @action
  handleDidEnterViewport() {
    console.log('entered viewport');
    if (!this.isPlayed && this.animation) {
      this.animation.play();
      this.isPlayed = true;
    }
  }
}
