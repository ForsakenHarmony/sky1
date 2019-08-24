import { Express } from "express";

export interface Middleware {
  apply(app: Express): void;
}
