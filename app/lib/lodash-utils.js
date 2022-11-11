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
