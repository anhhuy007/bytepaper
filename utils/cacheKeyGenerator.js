// utils/cacheKeyGenerator.js

const homeCacheKeyGenerator = (req) => {
  const type = req.query.type || "all";
  return `home:${type}`;
};

export default {
  homeCacheKeyGenerator,
};
