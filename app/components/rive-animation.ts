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
  @tracked animationAspectRatio: number = 0;

  get containerStyle(): string {
    return `width: ${this.containerWidth}px; height: ${this.containerHeight}px; max-width: 100%; display: block;`;
  }

  @action
  handleDidInsert(element: HTMLDivElement) {
    this.container = element;

    // Get initial size from parent
    const parentElement = element.parentElement;

    if (parentElement) {
      // Set to zero initially to avoid squished initial render
      this.containerWidth = 0;
      this.containerHeight = 0;

      // Set up ResizeObserver to update the container size
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newWidth = entry.contentRect.width;
          const newHeight = entry.contentRect.height;

          if (newWidth > 0 && newHeight > 0) {
            this.updateDimensions(newWidth, newHeight);

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
            // Get the animation bounds and calculate aspect ratio
            const bounds = this.riveInstance.bounds;

            if (bounds) {
              const width = bounds.maxX - bounds.minX;
              const height = bounds.maxY - bounds.minY;
              this.animationAspectRatio = width / height;

              // Get parent size again and update dimensions
              const parentElement = this.container?.parentElement;

              if (parentElement) {
                const parentRect = parentElement.getBoundingClientRect();
                this.updateDimensions(parentRect.width, parentRect.height);
              }
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

  private updateDimensions(width: number, height: number) {
    if (!this.animationAspectRatio) return;

    const containerAspectRatio = width / height;
    let newWidth = width;
    let newHeight = height;

    if (containerAspectRatio > this.animationAspectRatio) {
      // Container is wider than animation
      newHeight = width / this.animationAspectRatio;

      // If the calculated height is larger than container height, scale down
      if (newHeight > height) {
        newHeight = height;
        newWidth = height * this.animationAspectRatio;
      }
    } else {
      // Container is taller than animation
      newWidth = height * this.animationAspectRatio;

      // If the calculated width is larger than container width, scale down
      if (newWidth > width) {
        newWidth = width;
        newHeight = width / this.animationAspectRatio;
      }
    }

    this.containerWidth = newWidth;
    this.containerHeight = newHeight;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    RiveAnimation: typeof RiveAnimationComponent;
  }
}
