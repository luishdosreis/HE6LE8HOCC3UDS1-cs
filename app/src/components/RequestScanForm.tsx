"use client";

import { useFormState } from "react-dom";
import { requestScan } from "../app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const RequestScanForm = () => {
  const initialState = {
    message: "",
  };

  const [state, formAction] = useFormState(requestScan, initialState);
  const [commandInput, setCommandInput] = useState("");

  return (
    <form
      action={(formData) => {
        setCommandInput("");
        formAction(formData);
      }}
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
      <Button disabled={!commandInput} type="submit">
        Request Scan
      </Button>
    </form>
  );
};
