export interface ProgressIndicatorBase {
  text: string;
  textColor?: 'gray' | 'green' | 'yellow' | 'red';
  explanationMarkdown?: string;
}

export interface ProgressIndicatorWithoutDot extends ProgressIndicatorBase {
  dotType: 'none';
}

export interface ProgressIndicatorWithDot extends ProgressIndicatorBase {
  dotColor: 'green' | 'yellow' | 'gray' | 'red';
  dotType: 'static' | 'blinking';
}

type ProgressIndicator = ProgressIndicatorWithoutDot | ProgressIndicatorWithDot;

export { type ProgressIndicator as default };
