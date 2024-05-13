"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DownloadIcon } from "lucide-react";
import { Scan } from "@/models/scan";

const getScanStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "text-slate-500";
    case "running":
      return "text-blue-500";
    case "queued":
      return "text-yellow-500";
    default:
      return "text-slate-700";
  }
};

const formatDate = (date: string) => {
  return new Date(date as unknown as string).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ScansTable = ({ scans }: { scans: Scan[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Command</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Has Errors</TableHead>
          <TableHead>Created On</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scans.map((scan: Scan) => (
          <TableRow key={scan._id}>
            <TableCell className="font-medium">{scan.args}</TableCell>
            <TableCell className={getScanStatusColor(scan.status)}>
              {scan.status}
            </TableCell>
            <TableCell>
              {scan.hasErrors ? (
                <div className="rounded-full w-3 h-3 ml-auto mr-auto bg-red-500" />
              ) : null}
            </TableCell>
            <TableCell>{formatDate(scan.createdAt.toString())}</TableCell>
            <TableCell>
              {scan.updatedAt ? formatDate(scan.updatedAt.toString()) : null}
            </TableCell>
            <TableCell className="text-right">
              {scan.status == "completed" ? (
                <a href={`/api/scans/${scan._id}/download`}>
                  <DownloadIcon
                    size={20}
                    className="text-slate-400 hover:text-slate-600 active:text-slate-900 cursor-pointer"
                  />
                </a>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
