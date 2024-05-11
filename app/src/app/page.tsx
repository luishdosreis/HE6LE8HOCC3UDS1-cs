import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RequestScanForm } from "../components/RequestScanForm";
import { ScansTable } from "../components/ScansTable";
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

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; page_size?: string };
}) {
  const { scansCollection } = getDb();
  const pageSize = parsePaginationQueryParams({
    value: searchParams["page_size"],
    defaultValue: 10,
    max: 20,
  });

  const page = parsePaginationQueryParams({
    value: searchParams["page"],
    defaultValue: 0,
  });

  const scans = await scansCollection
    .find({})
    .sort({ createdAt: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  const scansTotal = await scansCollection.countDocuments();

  const previousPage = Math.max(0, page - 1);
  const nextPage = Math.floor(Math.min(scansTotal / pageSize, page + 1));

  return (
    <div className="flex items-center justify-center">
      <div className="p-10">
        <div className="w-[1000px]">
          <RequestScanForm />
          <ScansTable scans={scans} />
          <Pagination className="mt-5">
            <PaginationContent className="ml-auto">
              <PaginationItem>
                {page > 0 ? (
                  <PaginationPrevious
                    href={`?page=${previousPage}&page_size=${pageSize}`}
                  />
                ) : null}
              </PaginationItem>
              <PaginationItem>
                {Math.floor(scansTotal / pageSize) - 1 > page ? (
                  <PaginationNext
                    href={`?page=${nextPage}&page_size=${pageSize}`}
                  />
                ) : null}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
