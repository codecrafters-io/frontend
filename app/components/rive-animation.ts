import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Fit, Layout, Rive } from '@rive-app/canvas';
import * as Sentry from '@sentry/ember';

interface RiveAnimationSignature {
  Element: HTMLDivElement;
  Args: {
    src: string;
  };
}

export default class RiveAnimationComponent extends Component<RiveAnimationSignature> {
  animationInterval: number | null = null;
  container: HTMLElement | null = null;
  resizeObserver: ResizeObserver | null = null;
  @tracked riveInstance: Rive | null = null;
  @tracked containerWidth: number = 0;
  @tracked containerHeight: number = 0;

  get containerStyle(): string {
    return `width: ${this.containerWidth}px; height: ${this.containerHeight}px; max-width: 100%; display: block;`;
  }

  @action
  handleDidInsert(element: HTMLDivElement) {
    this.container = element;

    // Get initial size from parent
    const parentElement = element.parentElement;

    if (parentElement) {
      // Force a layout calculation to get accurate dimensions
      const parentRect = parentElement.getBoundingClientRect();
      this.containerWidth = parentRect.width;
      this.containerHeight = parentRect.height;

      // Set up ResizeObserver to update the container size
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newWidth = entry.contentRect.width;
          const newHeight = entry.contentRect.height;

          if (newWidth > 0 && newHeight > 0) {
            this.containerWidth = newWidth;
            this.containerHeight = newHeight;
            
            // Let Rive handle the resizing
            if (this.riveInstance) {
              this.riveInstance.resizeDrawingSurfaceToCanvas();
            }
          }
        }
      });

      // Only observe the immediate parent element
      this.resizeObserver.observe(parentElement);
    }

    try {
      const canvas = element.querySelector('canvas');
      if (!canvas) return;

      this.riveInstance = new Rive({
        src: this.args.src,
        canvas: canvas,
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
