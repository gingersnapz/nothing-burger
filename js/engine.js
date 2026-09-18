// Shuffle bags visit each entry before recycling, with no immediate repeat across bags.
export function createMachine(categories, random = Math.random) {
  const bags = new Map();
  let previous;
  return {
    next(categoryId = 'all') {
      const pool = categories.filter(c => categoryId === 'all' || c.id === categoryId)
        .flatMap(c => c.entries.map((entry, index) => ({...entry, category: c.label, symbol: c.symbol, key: `${c.id}:${index}`})));
      if (!pool.length) throw new Error(`Unknown or empty category: ${categoryId}`);
      let bag = bags.get(categoryId);
      if (!bag?.length) {
        bag = [...pool];
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        bags.set(categoryId, bag);
      }
      if (bag.length > 1 && bag.at(-1).key === previous) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
      const result = bag.pop();
      previous = result.key;
      return result;
    },
  };
}
