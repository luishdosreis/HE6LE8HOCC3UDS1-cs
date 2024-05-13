"use client";

import useSWR from "swr";
import { RequestScanForm } from "../components/RequestScanForm";
import { ScansTable } from "../components/ScansTable";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Scan } from "@/models/scan";
import { ScansTablePagination } from "@/components/ScansTablePagination";
import { fetcher, parsePaginationQueryParams } from "@/lib/utils";

interface ScansApiResponse {
  data: Scan[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export default function Home() {
  const params = useSearchParams();

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const listenToPopstate = useCallback(() => {
    const page = parsePaginationQueryParams({
      value: params.get("page") || "",
      defaultValue: 0,
    });
    const pageSize = parsePaginationQueryParams({
      value: params.get("page_size") || "",
      defaultValue: 10,
      max: 20,
    });

    setPage(page);
    setPageSize(pageSize);
  }, [params]);

  useEffect(() => {
    const page = parsePaginationQueryParams({
      value: params.get("page") || "",
      defaultValue: 0,
    });
    const pageSize = parsePaginationQueryParams({
      value: params.get("page_size") || "",
      defaultValue: 10,
      max: 20,
    });

    setPage(page);
    setPageSize(pageSize);

    window.addEventListener("popstate", listenToPopstate);
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
    };
  }, [listenToPopstate, params]);

  const { data, isLoading } = useSWR<ScansApiResponse>(
    `/api/scans?page=${page}&page_size=${pageSize}`,
    fetcher,
    {
      refreshInterval: 3000,
      keepPreviousData: true,
    }
  );

  return (
    <div className="flex items-center justify-center">
      <div className="p-10">
        <div className="w-[1000px]">
          <RequestScanForm page={page} pageSize={pageSize} />
          {isLoading || !data ? (
            <div>Loading...</div>
          ) : (
            <>
              <ScansTable scans={data.data} />
              <ScansTablePagination
                page={page}
                pageSize={pageSize}
                totalCount={data.totalCount}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
