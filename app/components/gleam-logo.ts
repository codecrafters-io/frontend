import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Rive, Layout, Fit, EventType, RiveEventType } from '@rive-app/canvas';

interface GleamLogoSignature {
  Element: HTMLDivElement;

  Args: {
    height: number;
  };

  Blocks: {
    default: [];
  };
}

export default class GleamLogoComponent extends Component<GleamLogoSignature> {
  @tracked riveInstance: Rive | null = null;
  container: HTMLElement | null = null;
  animationInterval: number | null = null;

  get containerStyle(): string {
    // Ensure minimum size on mobile while maintaining aspect ratio
    const minSize = Math.min(this.args.height, 200);
    return `height: ${minSize}px; width: ${minSize}px; max-width: 100%;`;
  }

  @action
  cleanupRive() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    if (this.riveInstance) {
      this.riveInstance.stop();
      this.riveInstance = null;
    }
  }

  @action
  handleDidInsert(element: HTMLDivElement) {
    this.container = element;

    try {
      const canvas = document.createElement('canvas');

      // Set initial canvas size for high quality
      const baseSize = 400; // Base size for quality
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
              inputs.forEach(input => {
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
            
            // Handle state changes for hover
            this.riveInstance.on(EventType.StateChange, (event: any) => {
              const stateName = event.data[0]; // State name is the first element in the array

              // Handle different states
              if (stateName === 'Hover') {
                // Add any hover-specific logic here
              } else if (stateName === 'Idle') {
                // Add any idle-specific logic here
              }
            });
          }
        },
      });
    } catch (error: unknown) {
      console.error('Error setting up Rive:', error);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    GleamLogo: typeof GleamLogoComponent;
  }
}
