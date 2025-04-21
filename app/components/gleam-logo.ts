import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Rive } from '@rive-app/canvas';

interface GleamLogoSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    style?: string;
    [key: string]: unknown;
  };
  Blocks: Record<string, never>;
}

export default class GleamLogoComponent extends Component<GleamLogoSignature> {
  @tracked riveInstance: Rive | null = null;
  container: HTMLElement | null = null;
  animationInterval: number | null = null;

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
  handleMouseEnter() {
    if (this.riveInstance) {
      const stateMachines = this.riveInstance.stateMachineNames;

      if (stateMachines && stateMachines.length > 0) {
        const stateMachineName = 'State Machine 1';

        if (stateMachines.includes(stateMachineName)) {
          this.riveInstance.reset();
          this.riveInstance.play(stateMachineName);
        }
      }
    }
  }

  @action
  handleMouseLeave() {
    if (this.riveInstance) {
      this.riveInstance.stop();
      this.riveInstance.reset();
    }
  }

  @action
  setupRive(element: HTMLDivElement) {
    this.container = element;

    try {
      const canvas = document.createElement('canvas');
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Set the canvas size to be 2x the original size for better quality
      canvas.width = 141 * 4;
      canvas.height = 144 * 4;

      // Scale the canvas to fit the container while maintaining aspect ratio
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.objectFit = 'contain';

      element.appendChild(canvas);

      this.riveInstance = new Rive({
        src: '/assets/animations/gleam_logo_animation.riv',
        canvas: canvas,
        autoplay: true,
        automaticallyHandleEvents: true,
        onLoad: () => {
          // Set up interval to play animation every 15 seconds
          this.animationInterval = window.setInterval(() => {
            if (this.riveInstance) {
              const stateMachines = this.riveInstance.stateMachineNames;

              if (stateMachines && stateMachines.length > 0) {
                const stateMachineName = 'State Machine 2';

                if (stateMachines.includes(stateMachineName)) {
                  this.riveInstance.reset();
                  this.riveInstance.play(stateMachineName);
                }
              }
            }

            // Simulate mouse leave after a short delay
            setTimeout(() => {
              this.handleMouseLeave();
            }, 2000);
          }, 15000);
          // Play initial animation with State Machine 2
          setTimeout(() => {
            if (this.riveInstance) {
              const stateMachines = this.riveInstance.stateMachineNames;

              if (stateMachines && stateMachines.length > 0) {
                const stateMachine2 = 'State Machine 2';

                if (stateMachines.includes(stateMachine2)) {
                  this.riveInstance.reset();
                  this.riveInstance.play(stateMachine2);

                  // Then after 800ms, reset State Machine 2
                  setTimeout(() => {
                    if (this.riveInstance) {
                      this.riveInstance.reset();
                    }
                  }, 800);
                }
              }
            }
          }, 500);
        },
      });
    } catch (error: unknown) {
      console.error('Error setting up Rive:', error);
    }
  }
}
