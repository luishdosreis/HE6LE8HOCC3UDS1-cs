import { getDb } from "@/lib/database";
import { scansQueue } from "@/lib/queue";
import { validateArgs } from "@/lib/sanitize";
import { parsePaginationQueryParams } from "@/lib/utils";
import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";

export async function GET({ url }: Request) {
  const { searchParams } = new URL(url);
  const { scansCollection } = getDb();
  const pageSize = parsePaginationQueryParams({
    value: searchParams.get("page") || "",
    defaultValue: 10,
    max: 20,
  });

  const page = parsePaginationQueryParams({
    value: searchParams.get("page") || "",
    defaultValue: 0,
  });

  const data = await scansCollection
    .find({})
    .sort({ createdAt: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  const totalCount = await scansCollection.countDocuments();

  return Response.json({
    data,
    totalCount,
    page,
    pageSize,
  });
}

export async function POST(req: Request) {
  const { scansCollection } = getDb();
  const body = await req.json();
  const args = body.args;

  try {
    validateArgs(body.args);
  } catch (error) {
    return Response.json({ message: "bad command arguments" }, { status: 400 });
  }

  try {
    const scanRecord = await scansCollection.insertOne({
      _id: new ObjectId().toString(),
      status: "queued",
      type: "nmap",
      args,
      createdAt: new Date(),
    });

    await scansQueue.add(randomUUID(), {
      scanId: scanRecord.insertedId,
      args,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "something went wrong" }, { status: 500 });
  }

  return Response.json({ message: "created" }, { status: 201 });
}
