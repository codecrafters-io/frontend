import { helper } from '@ember/component/helper';

export function formatDate([date]: [Date]): string {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

export default helper(formatDate); 