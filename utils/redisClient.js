import { createClient } from "redis";
import { config } from "dotenv";
config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log(`Connected to Redis at ${redisClient.options.url}`);
})();

export default redisClient;
