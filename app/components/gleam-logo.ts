import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Fit, Layout, Rive } from '@rive-app/canvas';
import * as Sentry from '@sentry/ember';

interface GleamLogoSignature {
  Element: HTMLDivElement;

  Args: {
    // Optional size for the logo
    size?: number;
  };

  Blocks: {
    default: [];
  };
}

export default class GleamLogoComponent extends Component<GleamLogoSignature> {
  animationInterval: number | null = null;
  container: HTMLElement | null = null;
  resizeObserver: ResizeObserver | null = null;
  @tracked riveInstance: Rive | null = null;
  @tracked containerSize: number = 0;

  get containerStyle(): string {
    const size = this.args.size || this.containerSize;

    return `height: ${size}px; width: ${size}px; max-width: 100%; display: block;`;
  }

  @action
  handleDidInsert(element: HTMLDivElement) {
    this.container = element;

    // Set up ResizeObserver if no size is provided
    if (!this.args.size) {
      // Get initial size from parent
      const parentElement = element.parentElement;

      if (parentElement) {
        // Force a layout calculation to get accurate dimensions
        const parentRect = parentElement.getBoundingClientRect();
        this.containerSize = Math.min(parentRect.width, parentRect.height);

        // Set up ResizeObserver to update the container size
        this.resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const newSize = Math.min(entry.contentRect.width, entry.contentRect.height);

            if (newSize > 0) {
              this.containerSize = newSize;
            }
          }
        });

        // Only observe the immediate parent element
        this.resizeObserver.observe(parentElement);
      }
    }

    try {
      const canvas = document.createElement('canvas');

      // Calculate base size based on device pixel ratio and container size
      const pixelRatio = window.devicePixelRatio || 1;
      const containerSize = this.args.size || this.containerSize;
      // Use 2x the container size for high quality, but cap at 4x for performance
      const qualityMultiplier = Math.min(4, Math.max(2, pixelRatio));
      const baseSize = Math.round(containerSize * qualityMultiplier);

      canvas.width = baseSize;
      canvas.height = baseSize;

      // Let the canvas scale naturally within its container
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.maxWidth = '100%'; // Ensure it doesn't overflow on mobile

      element.appendChild(canvas);

      this.riveInstance = new Rive({
        src: '/assets/animations/gleam_logo_animation.riv',
        canvas: canvas,
        stateMachines: 'State Machine 1',
        autoplay: true,
        automaticallyHandleEvents: true,
        layout: new Layout({
          fit: Fit.Contain,
        }),
        onLoad: () => {
          if (this.riveInstance) {
            // Initial resize
            this.riveInstance.resizeDrawingSurfaceToCanvas();

            const inputs = this.riveInstance.stateMachineInputs('State Machine 1');

            // Try to trigger hover state
            if (inputs) {
              inputs.forEach((input) => {
                if (input.name.toLowerCase().includes('hover')) {
                  input.value = true;

                  // Set timeout to trigger hover out after 1 second
                  setTimeout(() => {
                    if (this.riveInstance) {
                      input.value = false;
                    }
                  }, 1000);
                }
              });
            }
          }
        },
      });
    } catch (error: unknown) {
      console.error('Error setting up Rive:', error);
      Sentry.captureException(error, {
        tags: {
          component: 'GleamLogo',
          action: 'handleDidInsert',
        },
      });
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
    GleamLogo: typeof GleamLogoComponent;
  }
}
