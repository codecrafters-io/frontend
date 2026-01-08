export function partition<T>(collection: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return collection.reduce<[T[], T[]]>(
    (acc, item) => {
      if (predicate(item)) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }

      return acc;
    },
    [[], []],
  );
}

// Break down collection in multiple chunks of size `chunkSize` and return them.
export function chunk<T>(collection: T[], chunkSize: number): T[][] {
  return collection.reduce<T[][]>((acc, item, index) => {
    if (index % chunkSize === 0) {
      acc.push([]);
    }

    acc[acc.length - 1]!.push(item);

    return acc;
  }, []);
}

// Break down collection into N (numberOfChunks) chunks of equal size and return them.
export function split<T>(collection: T[], numberOfChunks: number): T[][] {
  const chunkSize = Math.ceil(collection.length / numberOfChunks);

  return chunk(collection, chunkSize);
}

// Same as Python's zip
export function zip<T extends unknown[][]>(...arrays: T): unknown[][] {
  return unzip(arrays);
}

export function unzip(array: unknown[][]): unknown[][] {
  if (!(array != null && array.length)) {
    return [];
  }

  const length = Math.max(...array.map((group) => group.length));

  let index = -1;
  const result = new Array<unknown[]>(length);

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
