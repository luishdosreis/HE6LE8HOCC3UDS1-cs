import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const parsePaginationQueryParams = ({
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
