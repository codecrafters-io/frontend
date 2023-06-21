import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCircle?: boolean;
    width?: 'full' | number;
  };
}

export default class LoadingSkeletonComponent extends Component<Signature> {
  get widthStyle(): string {
    if (this.args.width === 'full') {
      return 'width: 100%;';
    } else if (this.args.width) {
      return `width: ${this.args.width}px;`;
    } else {
      return 'width: 100%;';
    }
  }
}
