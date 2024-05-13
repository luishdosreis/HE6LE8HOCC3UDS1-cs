import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

interface ScansTablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
}

export const ScansTablePagination = ({
  page,
  pageSize,
  totalCount,
}: ScansTablePaginationProps) => {
  const router = useRouter();

  const previousPage = Math.max(0, page - 1);
  const nextPage = Math.floor(Math.min(totalCount / pageSize, page + 1));

  return (
    <Pagination className="mt-5">
      <PaginationContent className="ml-auto">
        <PaginationItem className="cursor-pointer">
          {page > 0 ? (
            <PaginationPrevious
              onClick={() =>
                router.replace(`?page=${previousPage}&page_size=${pageSize}`)
              }
            />
          ) : null}
        </PaginationItem>
        <PaginationItem className="cursor-pointer">
          {Math.floor(totalCount / pageSize) > page ? (
            <PaginationNext
              onClick={() =>
                router.replace(`?page=${nextPage}&page_size=${pageSize}`)
              }
            />
          ) : null}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
