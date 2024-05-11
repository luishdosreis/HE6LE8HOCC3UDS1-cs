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
            <TableCell>
              {new Date(scan.createdAt as unknown as string).toUTCString()}
            </TableCell>
            <TableCell>
              {new Date(scan.updatedAt as unknown as string)?.toUTCString()}
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
