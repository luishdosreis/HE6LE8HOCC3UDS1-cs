"use client";

import { FormEvent, useState } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RequestScanFormProps {
  page: number;
  pageSize: number;
}

const requestScan = async (url: string, { arg }: { arg: { args: string } }) => {
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
};

export const RequestScanForm = ({ page, pageSize }: RequestScanFormProps) => {
  const { trigger, isMutating } = useSWRMutation("/api/scans", requestScan);
  const { mutate } = useSWRConfig();

  const [commandInput, setCommandInput] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      trigger({ args: commandInput });
      mutate(`/api/scans?page=${page}&page_size=${pageSize}`);
    } catch (error) {}
  };

  return (
    <form
      onSubmit={onSubmit}
      className="pb-10 flex flex-row justify-between items-center"
    >
      <div className="mr-10 flex flex-row items-center flex-1">
        <div className="mr-4 font-bold">nmap</div>
        <Input
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          name="args"
          type="text"
          placeholder="Enter options/flags for NMAP command"
        />
      </div>
      <Button disabled={!commandInput || isMutating} type="submit">
        Request Scan
      </Button>
    </form>
  );
};
