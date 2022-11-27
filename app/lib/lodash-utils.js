export function groupBy(collection, keyOrFn) {
  return collection.reduce((acc, item) => {
    if (typeof keyOrFn === 'string') {
      let key = keyOrFn;
      keyOrFn = (x) => x[key];
    }

    const groupKey = keyOrFn(item);
    acc[groupKey] = acc[groupKey] || [];
    acc[groupKey].push(item);

    return acc;
  }, {});
}

export function partition(collection, predicate) {
  return collection.reduce(
    (acc, item) => {
      if (predicate(item)) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }

      return acc;
    },
    [[], []]
  );
}

// Break down collection in multiple chunks of size `chunkSize` and return them.
export function chunk(collection, chunkSize) {
  return collection.reduce((acc, item, index) => {
    if (index % chunkSize === 0) {
      acc.push([]);
    }

    acc[acc.length - 1].push(item);

    return acc;
  }, []);
}

// Break down collection into N (numberOfChunks) chunks of equal size and return them.
export function split(collection, numberOfChunks) {
  let chunkSize = Math.ceil(collection.length / numberOfChunks);

  return chunk(collection, chunkSize);
}
