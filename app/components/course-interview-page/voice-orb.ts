import Component from '@glimmer/component';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import { action } from '@ember/object';
import { service } from '@ember/service';

type Rgb = [number, number, number];

const AGENT_COLOR: Rgb = [45, 212, 191];
const COLOR_EASING = 0.08;
const DOT_COUNT = 180;
const LEVEL_SMOOTHING = 0.15;
const RING_COUNT = 4;
const USER_COLOR: Rgb = [148, 163, 184];

interface Signature {
  Element: HTMLDivElement;
}

export default class CourseInterviewPageVoiceOrb extends Component<Signature> {
  @service declare voiceInterview: VoiceInterviewService;

  #animationFrame: number | null = null;
  #canvas: HTMLCanvasElement | null = null;
  #color: Rgb = [...USER_COLOR];
  #prefersReducedMotion = false;
  #smoothedLevel = 0;

  get statusText(): string {
    if (this.voiceInterview.isConnecting) {
      return 'Connecting';
    }

    return this.voiceInterview.mode === 'speaking' ? 'Interviewer is speaking' : 'Your turn to speak';
  }

  #currentLevel(): number {
    const frequencyData = this.voiceInterview.getFrequencyData();

    if (!frequencyData || frequencyData.length === 0) {
      return 0;
    }

    const total = frequencyData.reduce((sum, value) => sum + value, 0);

    return Math.min(1, total / frequencyData.length / 128);
  }

  #draw = (time: number): void => {
    const canvas = this.#canvas;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const { width, height } = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(width * pixelRatio) || canvas.height !== Math.round(height * pixelRatio)) {
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    this.#smoothedLevel += ((this.#prefersReducedMotion ? 0 : this.#currentLevel()) - this.#smoothedLevel) * LEVEL_SMOOTHING;
    this.#easeColorTowards(this.voiceInterview.mode === 'speaking' ? AGENT_COLOR : USER_COLOR);

    const color = this.#color.map(Math.round).join(', ');
    const baseRadius = Math.min(width, height) * 0.32;

    this.#drawGlow(context, width / 2, height / 2, baseRadius, color);
    this.#drawRings(context, width / 2, height / 2, baseRadius, color, this.#prefersReducedMotion ? 0 : time);

    this.#animationFrame = window.requestAnimationFrame(this.#draw);
  };

  #drawGlow(context: CanvasRenderingContext2D, centerX: number, centerY: number, baseRadius: number, color: string): void {
    const glowRadius = baseRadius * 1.5;
    const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);

    glow.addColorStop(0, `rgba(${color}, ${0.08 + this.#smoothedLevel * 0.22})`);
    glow.addColorStop(1, `rgba(${color}, 0)`);

    context.fillStyle = glow;
    context.beginPath();
    context.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
    context.fill();
  }

  #drawRings(context: CanvasRenderingContext2D, centerX: number, centerY: number, baseRadius: number, color: string, time: number): void {
    const dotSize = Math.max(1.6, baseRadius / 60);
    const ringSpacing = Math.max(5, baseRadius / 18);

    for (let index = 0; index < DOT_COUNT; index++) {
      const angle = (index / DOT_COUNT) * Math.PI * 2;
      const wobble = Math.sin(angle * 6 + time / 400) * 0.5 + Math.sin(angle * 11 - time / 650) * 0.5;
      const radius = baseRadius * (1 + this.#smoothedLevel * 0.4 * (0.6 + 0.4 * wobble)) + wobble * 2;

      for (let ring = 0; ring < RING_COUNT; ring++) {
        const ringRadius = radius - ring * ringSpacing * (1 + this.#smoothedLevel);

        context.fillStyle = `rgba(${color}, ${0.85 - ring * 0.2})`;
        context.fillRect(centerX + Math.cos(angle) * ringRadius, centerY + Math.sin(angle) * ringRadius, dotSize, dotSize);
      }
    }
  }

  #easeColorTowards(target: Rgb): void {
    this.#color = this.#color.map((channel, index) => channel + (target[index]! - channel) * COLOR_EASING) as Rgb;
  }

  @action
  handleDidInsertCanvas(canvas: HTMLCanvasElement): void {
    this.#canvas = canvas;
    this.#prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.#draw(0);
  }

  willDestroy(): void {
    super.willDestroy();
    this.#canvas = null;

    if (this.#animationFrame !== null) {
      window.cancelAnimationFrame(this.#animationFrame);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::VoiceOrb': typeof CourseInterviewPageVoiceOrb;
  }
}
