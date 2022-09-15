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
