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
    [[], []],
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

// Same as Python's zip
export function zip(...arrays) {
  return unzip(arrays);
}

export function unzip(array) {
  if (!(array != null && array.length)) {
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

const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(html) {
  return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
}
