"use server";

import { getDb } from "@/lib/database";
import { scansQueue } from "@/lib/queue";
import { validateArgs } from "@/lib/sanitize";
import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function requestScan(
  _prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  const { scansCollection } = getDb();

  const args = formData.get("args")?.toString() || "";

  try {
    validateArgs(args);
  } catch (error) {
    return { message: "Something went wrong" };
  }

  try {
    const scanRecord = await scansCollection.insertOne({
      _id: new ObjectId().toString(),
      status: "queued",
      type: "nmap",
      args,
      createdAt: new Date(),
    });

    await scansQueue.add(
      randomUUID(),
      {
        scanId: scanRecord.insertedId,
        args,
      },
      {
        attempts: 1,
      }
    );
  } catch (error) {
    console.error(error);
    return { message: "Something went wrong" };
  }

  revalidatePath("/");
  return { message: "created" };
}
