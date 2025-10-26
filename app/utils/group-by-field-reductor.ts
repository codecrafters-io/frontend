export default function groupByFieldReductor<T>(keyFn: (item: T) => string | number | symbol) {
  return (result: { [key: string | number | symbol]: T[] }, element: T) => {
    const groupKey = keyFn(element);

    if (Object.hasOwnProperty.call(result, groupKey)) {
      result[groupKey]!.push(element);
    } else {
      result[groupKey] = [element];
    }

    return result;
  };
}
