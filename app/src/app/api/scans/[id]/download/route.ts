import { getDb } from "@/lib/database";
import { scansQueue } from "@/lib/queue";
import { validateArgs } from "@/lib/sanitize";
import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { scansCollection, scansOutputsCollection } = getDb();

  const scan = await scansCollection.findOne({
    _id: params.id,
  });

  if (!scan) {
    return Response.json(
      { message: "scan not found" },
      {
        status: 404,
      }
    );
  }

  const scanOutput = await scansOutputsCollection.findOne({
    scanId: params.id,
  });

  if (!scanOutput || (!scanOutput.result && !scanOutput.error)) {
    return Response.json(
      { message: "scan output not found" },
      {
        status: 404,
      }
    );
  }

  return new Response(scanOutput.result || scanOutput.error, {
    headers: {
      "Content-Type": "text/xml",
      "Content-Disposition": `attachment; filename=${scan._id}_output.xml`,
    },
  });
}
