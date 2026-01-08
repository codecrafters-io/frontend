export function partition<T>(collection: ReadonlyArray<T>, predicate: (item: T, index: number, collection: ReadonlyArray<T>) => boolean): [T[], T[]] {
  return collection.reduce<[T[], T[]]>(
    (acc, item, index) => {
      if (predicate(item, index, collection)) {
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
export function chunk<T>(collection: ReadonlyArray<T>, chunkSize: number): T[][] {
  if (chunkSize <= 0) {
    return [];
  }

  return collection.reduce<T[][]>((acc, item, index) => {
    if (index % chunkSize === 0) {
      acc.push([]);
    }

    acc[acc.length - 1]!.push(item);

    return acc;
  }, []);
}

// Break down collection into N (numberOfChunks) chunks of equal size and return them.
export function split<T>(collection: ReadonlyArray<T>, numberOfChunks: number): T[][] {
  if (numberOfChunks <= 0) {
    return [];
  }

  const chunkSize = Math.ceil(collection.length / numberOfChunks);

  return chunk(collection, chunkSize);
}

type ZipResult<T extends readonly ReadonlyArray<unknown>[]> = Array<{
  [K in keyof T]: T[K] extends ReadonlyArray<infer U> ? U : never;
}>;

// Same as Python's zip
export function zip<T1, T2>(array1: ReadonlyArray<T1>, array2: ReadonlyArray<T2>): Array<[T1, T2]>;
export function zip<T extends readonly ReadonlyArray<unknown>[]>(...arrays: T): ZipResult<T>;
export function zip(...arrays: ReadonlyArray<unknown>[]): unknown[] {
  if (arrays.length === 0) {
    return [];
  }

  const length = Math.min(...arrays.map((group) => group.length));
  const result = new Array(length);

  for (let index = 0; index < length; index++) {
    result[index] = arrays.map((group) => group[index]!);
  }

  return result;
}

export function unzip<T>(array: ReadonlyArray<ReadonlyArray<T>>): Array<Array<T | undefined>> {
  if (!(array != null && array.length)) {
    return [];
  }

  const length = Math.max(...array.map((group) => group.length));
  let index = -1;
  const result = new Array<Array<T | undefined>>(length);

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
