export function partition<T>(collection: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return collection.reduce(
    (acc, item) => {
      if (predicate(item)) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }

      return acc;
    },
    [[], []] as [T[], T[]],
  );
}

// Break down collection in multiple chunks of size `chunkSize` and return them.
export function chunk<T>(collection: T[], chunkSize: number): T[][] {
  return collection.reduce((acc, item, index) => {
    if (index % chunkSize === 0) {
      acc.push([]);
    }

    acc[acc.length - 1]!.push(item);

    return acc;
  }, [] as T[][]);
}

// Break down collection into N (numberOfChunks) chunks of equal size and return them.
export function split<T>(collection: T[], numberOfChunks: number): T[][] {
  const chunkSize = Math.ceil(collection.length / numberOfChunks);

  return chunk(collection, chunkSize);
}

// Same as Python's zip
export function zip<T1, T2>(a1: readonly T1[], a2: readonly T2[]): [T1, T2][];
export function zip<T>(...arrays: (readonly T[])[]): T[][];
export function zip(...arrays: any[][]): any[][];
export function zip(...arrays: any[][]): any[][] {
  return unzip(arrays);
}

export function unzip<T>(array: (readonly T[])[]): T[][] {
  if (!(array !== null && array.length)) {
    return [];
  }

  const length = Math.max(...array.map((group) => group.length));

  let index = -1;
  const result = new Array(length);

  while (++index < length) {
    result[index] = array.map((group) => group[index]);
  }

  return result;
}

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(html: string): string {
  return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]!);
}
