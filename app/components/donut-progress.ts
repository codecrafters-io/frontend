import Component from '@glimmer/component';

interface DonutProgressArgs {
  total: number;
  completed: number;
  size?: number;
  class?: string;
}

export default class DonutProgress extends Component<{ Args: DonutProgressArgs; Element: SVGElement }> {}
