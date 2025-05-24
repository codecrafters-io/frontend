import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Fit, Layout, Rive } from '@rive-app/canvas';
import * as Sentry from '@sentry/ember';

interface RiveAnimationSignature {
  Element: HTMLCanvasElement;
  Args: {
    src: string;
  };
}

export default class RiveAnimationComponent extends Component<RiveAnimationSignature> {
  animationInterval: number | null = null;
  resizeObserver: ResizeObserver | null = null;
  @tracked riveInstance: Rive | null = null;
  @tracked animationAspectRatio: number = 0;

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
            // Get the animation bounds and calculate aspect ratio
            const bounds = this.riveInstance.bounds;

            if (bounds) {
              const width = bounds.maxX - bounds.minX;
              const height = bounds.maxY - bounds.minY;
              this.animationAspectRatio = width / height;
            }

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
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

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
    RiveAnimation: typeof RiveAnimationComponent;
  }
}
