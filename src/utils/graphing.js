let calcAvg = arr => {
  // calc avg fields of array of objects
  let avg = {};
  let mapped = arr.reduce(
    (acc, obj) =>
      Object.keys(obj).reduce(
        (acc, key) =>
          acc.set(
            key,
            (([sum, count]) => [sum + obj[key], count + 1])(
              acc.get(key) || [0, 0]
            )
          ),
        acc
      ),
    new Map()
  );
  mapped.forEach((k, v) => (avg[v] = k[0] / k[1]));
  return avg;
};

export { calcAvg };
