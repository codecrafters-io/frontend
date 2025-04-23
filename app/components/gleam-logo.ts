import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Rive, Layout, Fit } from '@rive-app/canvas';

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
    return `height: ${this.args.height}px; width: auto;`;
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
      canvas.width = 400; // Base size for quality
      canvas.height = 400; // Will adjust based on container

      // Let the canvas scale naturally within its container
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';

      element.appendChild(canvas);

      this.riveInstance = new Rive({
        src: '/assets/animations/gleam_logo_animation.riv',
        canvas: canvas,
        layout: new Layout({
          fit: Fit.Contain,
        }),
        autoplay: false,
        onLoad: () => {
          console.log('onLoad');

          if (this.riveInstance) {
            const stateMachines = this.riveInstance.stateMachineNames;

            if (stateMachines?.includes('State Machine 2')) {
              // Play first time immediately
              this.riveInstance.play('State Machine 2');
            }

            // Play State Machine 3 after 1 second to reset
            setTimeout(() => {
              if (this.riveInstance) {
                this.riveInstance.play('State Machine 3');
              }
            }, 1000);

            // Set up hover state machine
            canvas.addEventListener('mouseenter', () => {
              if (this.riveInstance) {
                this.riveInstance.play('State Machine 1');
              }
            });

            canvas.addEventListener('mouseleave', () => {
              if (this.riveInstance) {
                this.riveInstance.play('State Machine 1');
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
