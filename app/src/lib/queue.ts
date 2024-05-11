import { Queue } from "bullmq";

export const scansQueue = new Queue("scans", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
  },
});

export const dlQueue = new Queue("dlqueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
  },
});
