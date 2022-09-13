export function groupBy(collection, key) {
  return collection.reduce((acc, item) => {
    const groupKey = item[key];
    acc[groupKey] = acc[groupKey] || [];
    acc[groupKey].push(item);

    return acc;
  }, {});
}
