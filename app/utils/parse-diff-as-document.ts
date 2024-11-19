export default function parseDiffAsDocument(diff: string = '') {
  const diffLines = diff.split('\n');

  const current = [];
  const original = [];

  for (const line of diffLines) {
    if (line.startsWith('-')) {
      original.push(line.substring(1));
    } else if (line.startsWith('+')) {
      current.push(line.substring(1));
    } else {
      original.push(line.substring(1));
      current.push(line.substring(1));
    }
  }

  return {
    current: current.join('\n'),
    original: original.join('\n'),
  };
}
