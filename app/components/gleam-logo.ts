import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Rive } from '@rive-app/canvas';

export default class GleamLogoComponent extends Component {
  @tracked riveInstance: Rive | null = null;
  container: HTMLElement | null = null;

  @action
  setupRive(element: HTMLElement) {
    this.container = element;
    
    try {
      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 141;  // Fixed size for crisp rendering
      canvas.height = 144;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.border = '1px solid red'; // Visual debugging
      element.appendChild(canvas);

      // Initialize Rive
      this.riveInstance = new Rive({
        src: '/assets/animations/gleam_logo_animation.riv',
        canvas: canvas,
        autoplay: false,
        onLoad: () => {
          console.log('Gleam logo animation loaded');
          
          // Log available state machines
          const stateMachines = this.riveInstance?.stateMachineNames;
          console.log('All State Machines:', stateMachines);
          
          if (stateMachines && stateMachines.length > 0) {
            // Log details about each state machine
            stateMachines.forEach((name, index) => {
              console.log(`State Machine ${index + 1}:`, {
                name,
                inputs: this.riveInstance?.stateMachineInputs(name)
              });
            });
          }
          
          // Play initial animation directly with longer delay
          setTimeout(() => {
            if (this.riveInstance) {
              const stateMachines = this.riveInstance.stateMachineNames;
              if (stateMachines && stateMachines.length > 0) {
                // Try each state machine
                stateMachines.forEach((stateMachineName) => {
                  console.log('Attempting to play with state machine:', stateMachineName);
                  
                  // Reset and play
                  this.riveInstance?.reset();
                  this.riveInstance?.play(stateMachineName);
                  
                  // Log animation state after a short delay
                  setTimeout(() => {
                    if (this.riveInstance) {
                      console.log('Animation state after play:', {
                        stateMachine: stateMachineName,
                        isPlaying: this.riveInstance.isPlaying,
                        isPaused: this.riveInstance.isPaused,
                        isStopped: this.riveInstance.isStopped,
                        allStateMachines: this.riveInstance.stateMachineNames
                      });
                    }
                  }, 500);
                });
              }
            }
          }, 2000);
        }
      });
    } catch (error: unknown) {
      console.error('Error setting up Rive:', error);
    }
  }

  @action
  handleMouseEnter() {
    if (this.riveInstance) {
      const stateMachines = this.riveInstance.stateMachineNames;
      if (stateMachines && stateMachines.length > 0) {
        const stateMachineName = stateMachines[0];
        console.log('Playing hover animation with state machine:', stateMachineName);
        this.riveInstance.reset();
        this.riveInstance.play(stateMachineName);
      }
    }
  }

  @action
  handleMouseLeave() {
    if (this.riveInstance) {
      // Stop the animation and reset to initial state
      this.riveInstance.stop();
      this.riveInstance.reset();
    }
  }

  @action
  cleanupRive() {
    if (this.riveInstance) {
      this.riveInstance.stop();
      this.riveInstance = null;
    }
  }
}