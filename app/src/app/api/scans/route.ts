import { getDb } from "@/lib/database";

const parsePaginationQueryParams = ({
  value,
  defaultValue,
  max,
}: {
  value?: string;
  defaultValue: number;
  max?: number;
}): number => {
  let param = defaultValue;
  try {
    param = parseInt(value || "0", 10);
    param = Math.max(param, defaultValue);
    if (max) {
      param = Math.min(param, max);
    }
  } catch (error) {
    param = defaultValue;
  }
  return param;
};

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

  console.log(data);

  const totalCount = await scansCollection.countDocuments();

  return Response.json({
    data,
    totalCount,
    page,
    pageSize,
  });
}
