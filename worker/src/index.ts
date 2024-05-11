import { execFileSync } from "node:child_process";
import { Job, Worker } from "bullmq";
import { validateArgs } from "./lib/sanitize";
import { getDb } from "./lib/database";

interface JobData {
  args: string;
  scanId: string;
}

const worker = new Worker(
  "scans",
  async (job: Job<JobData>) => {
    const { scansCollection, scansOutputsCollection } = getDb();
    const scanObjectId = job.data.scanId;

    try {
      validateArgs(job.data.args);
    } catch (error) {
      console.log();
      await scansCollection.updateOne(
        { _id: scanObjectId },
        {
          $set: {
            status: "completed",
            hasErrors: true,
            updatedAt: new Date(),
          },
        }
      );
      await scansOutputsCollection.insertOne({
        scanId: scanObjectId,
        createdAt: new Date(),
        error: "arguments did not pass validation",
      });
    }

    try {
      await scansCollection.updateOne(
        { _id: scanObjectId },
        {
          $set: {
            status: "running",
            updatedAt: new Date(),
          },
        }
      );
    } catch (error) {
      console.error(error);
    }

    let result;

    try {
      result = execFileSync("nmap", ["-oX", "-", ...job.data.args.split(" ")]);
    } catch (error) {
      await scansCollection.updateOne(
        { _id: scanObjectId },
        {
          $set: {
            status: "completed",
            hasErrors: true,
            updatedAt: new Date(),
          },
        }
      );
      await scansOutputsCollection.insertOne({
        scanId: scanObjectId,
        error: error.toString(),
        createdAt: new Date(),
      });
    }

    try {
      await scansCollection.updateOne(
        { _id: scanObjectId },
        {
          $set: {
            status: "completed",
            hasErrors: false,
            updatedAt: new Date(),
          },
        }
      );
      await scansOutputsCollection.insertOne({
        scanId: scanObjectId,
        result: result.toString(),
        createdAt: new Date(),
      });
    } catch (error) {
      await scansCollection.updateOne(
        { _id: scanObjectId },
        {
          $set: {
            status: "completed",
            hasErrors: true,
            updatedAt: new Date(),
          },
        }
      );
      await scansOutputsCollection.insertOne({
        scanId: scanObjectId,
        error: error.toString(),
        createdAt: new Date(),
      });
    }

    return job;
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT as unknown as number,
    },
  }
);

worker.on("error", (error) => {
  console.log("****************************");
  console.log(error);
  console.log("****************************");
});

worker.on("active", () => {
  console.log("****************************");
  console.log("IM ACTIVE");
  console.log("****************************");
});

worker.on("ready", () => {
  console.log("****************************");
  console.log("IM READY");
  console.log("****************************");
});
