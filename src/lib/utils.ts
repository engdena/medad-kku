import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** True only for http(s) URLs, so user-supplied links can't be javascript: or data: URLs. */
export const isHttpUrl = (url: string) => /^https?:\/\//i.test(url);
