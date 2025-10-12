export default function uniqReductor<T>() {
  const seen = new Set<T>();

  return (acc: T[], item: T): T[] => {
    if (!seen.has(item)) {
      seen.add(item);
      acc.push(item);
    }

    return acc;
  };
}
