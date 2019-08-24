import { randomBytes } from "crypto";

export type Lazy<T extends object> = Promise<T> | T;

export function randomHexString(len: number): string {
  return randomBytes(len / 2)
    .toString("hex")
    .slice(0, len);
}
