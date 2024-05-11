export interface Scan {
  _id: string;
  type: string;
  args: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
  hasErrors?: boolean;
}

export interface ScanOutput {
  scanId: string;
  createdAt: Date;
  result?: string;
  error?: string;
}
