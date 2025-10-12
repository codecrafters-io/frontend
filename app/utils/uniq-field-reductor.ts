export default function uniqFieldReductor<T, K extends keyof T>(fieldName: K) {
  const seen = new Set<T[K]>();

  return (acc: T[], item: T): T[] => {
    const value = item[fieldName];

    if (!seen.has(value)) {
      seen.add(value);
      acc.push(item);
    }

    return acc;
  };
}
