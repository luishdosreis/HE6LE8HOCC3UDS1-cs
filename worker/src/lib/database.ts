import { Scan, ScanOutput } from "../models/scan";
import { MongoClient } from "mongodb";

export const getDb = () => {
  const client = new MongoClient(process.env.MONGO_CONN_STRING || "");
  const database = client.db(process.env.MONGO_DB_NAME || "");
  const scansCollection = database.collection<Scan>("scans");
  const scansOutputsCollection =
    database.collection<ScanOutput>("scans_outputs");

  return { scansCollection, scansOutputsCollection };
};
