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
    console.log('Hover animation starting');

    if (this.riveInstance) {
      console.log('Hover - Rive instance:', this.riveInstance);
      const stateMachines = this.riveInstance.stateMachineNames;
      console.log('Hover - Available state machines:', stateMachines);

      if (stateMachines && stateMachines.length > 0) {
        const stateMachineName = 'State Machine 1';

        if (stateMachines.includes(stateMachineName)) {
          console.log('Hover - Playing state machine:', stateMachineName);
          const inputs = this.riveInstance.stateMachineInputs(stateMachineName);
          console.log('Hover - State machine inputs:', inputs);
          this.riveInstance.reset();
          this.riveInstance.play(stateMachineName);
          console.log('Hover - Play called on state machine');
        } else {
          console.log('State Machine 1 not found, available machines:', stateMachines);
        }
      }
    }
  }

  @action
  handleMouseLeave() {
    console.log('Hover animation stopping');

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
      canvas.width = 141;
      canvas.height = 144;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      element.appendChild(canvas);

      this.riveInstance = new Rive({
        src: '/assets/animations/gleam_logo_animation.riv',
        canvas: canvas,
        autoplay: true,
        automaticallyHandleEvents: true,
        onLoad: () => {
          console.log('Rive file loaded');
          // Set up interval to play animation every 15 seconds
          this.animationInterval = window.setInterval(() => {
            console.log('Interval - Playing animation');

            if (this.riveInstance) {
              console.log('Interval - Rive instance:', this.riveInstance);
              const stateMachines = this.riveInstance.stateMachineNames;
              console.log('Interval - Available state machines:', stateMachines);

              if (stateMachines && stateMachines.length > 0) {
                const stateMachineName = 'State Machine 2';

                if (stateMachines.includes(stateMachineName)) {
                  console.log('Interval - Playing state machine:', stateMachineName);
                  const inputs = this.riveInstance.stateMachineInputs(stateMachineName);
                  console.log('Interval - State machine inputs:', inputs);
                  this.riveInstance.reset();
                  this.riveInstance.play(stateMachineName);
                  console.log('Interval - Play called on state machine');
                } else {
                  console.log('State Machine 2 not found, available machines:', stateMachines);
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
                // First play State Machine 2
                const stateMachine2 = 'State Machine 2';

                if (stateMachines.includes(stateMachine2)) {
                  console.log('Initial - Playing state machine:', stateMachine2);
                  this.riveInstance.reset();
                  this.riveInstance.play(stateMachine2);

                  // Then after 800ms, reset State Machine 2
                  setTimeout(() => {
                    if (this.riveInstance) {
                      console.log('Initial - Resetting state machine:', stateMachine2);
                      this.riveInstance.reset();
                    }
                  }, 800);
                } else {
                  console.log('State Machine 2 not found, available machines:', stateMachines);
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
