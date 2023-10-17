export interface ProgressIndicatorWithoutDot {
  dotType: 'none';
  text: string;
}

export interface ProgressIndicatorWithDot {
  dotColor: 'green' | 'yellow' | 'gray' | 'red';
  dotType: 'static' | 'blinking';
  text: string;
}

type ProgressIndicator = ProgressIndicatorWithoutDot | ProgressIndicatorWithDot;

export default ProgressIndicator;
