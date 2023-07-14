interface ProgressIndicatorWithoutDot {
  dotType: 'none';
  text: string;
}

interface ProgressIndicatorWithDot {
  dotColor?: 'green' | 'yellow' | 'gray' | 'red';
  dotType: 'static' | 'blinking';
  text: string;
}

type ProgressIndicator = ProgressIndicatorWithoutDot | ProgressIndicatorWithDot;

export default ProgressIndicator;
