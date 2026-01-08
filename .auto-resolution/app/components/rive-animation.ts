import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Fit, Layout, Rive } from '@rive-app/canvas';
import * as Sentry from '@sentry/ember';

interface Signature {
  Element: HTMLCanvasElement;
  Args: {
    src: string;
  };
}

export default class RiveAnimation extends Component<Signature> {
  resizeObserver: ResizeObserver | null = null;
  @tracked riveInstance: Rive | null = null;

  @action
  handleDidInsert(element: HTMLCanvasElement) {
    // Set up ResizeObserver to handle canvas resizing
    this.resizeObserver = new ResizeObserver(() => {
      if (this.riveInstance) {
        this.riveInstance.resizeDrawingSurfaceToCanvas();
      }
    });

    // Observe the canvas element itself
    this.resizeObserver.observe(element);

    try {
      this.riveInstance = new Rive({
        src: this.args.src,
        canvas: element,
        stateMachines: 'Default',
        autoplay: true,
        automaticallyHandleEvents: true,
        layout: new Layout({
          fit: Fit.Contain,
        }),
        onLoad: async () => {
          if (this.riveInstance) {
            // Initial resize
            this.riveInstance.resizeDrawingSurfaceToCanvas();
          }
        },
      });
    } catch (error: unknown) {
      console.error('Error setting up Rive:', error);
      Sentry.captureException(error);
    }
  }

  @action
  handleWillDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.riveInstance) {
      this.riveInstance.stop();
      this.riveInstance = null;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    RiveAnimation: typeof RiveAnimation;
  }
}
