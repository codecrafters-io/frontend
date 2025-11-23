import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'dark-gray' | 'white' | 'teal';
    size?: 'small' | 'regular';
  };

  Blocks: {
    default: [];
  };
}

export default class Pill extends Component<Signature> {
  get colorClasses() {
    return {
      'dark-gray': 'bg-gray-200 text-gray-700 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-400/20',
      blue: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-400/20',
      gray: 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-400/20',
      green: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950 dark:text-green-400 dark:ring-green-400/20',
      red: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950 dark:text-red-400 dark:ring-red-400/20',
      teal: 'bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-950 dark:text-teal-400 dark:ring-teal-400/20',
      white: 'bg-white text-gray-600 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-400/20',
      yellow: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-950 dark:text-yellow-400 dark:ring-yellow-400/20',
    }[this.args.color];
  }

  get sizeIsRegular() {
    return !this.args.size || this.args.size === 'regular';
  }

  get sizeIsSmall() {
    return this.args.size === 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Pill: typeof Pill;
  }
}
