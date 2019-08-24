import { createClient } from "@pql/boost";
import { getValidPayloadFromToken } from "./jwt";

if (typeof window !== "undefined" && !getValidPayloadFromToken(window.localStorage.jwt)) {
  window.localStorage.removeItem("jwt");
}

export function buildHeaders() {
  const headers: any = {};
  if (typeof window !== "undefined") {
    const jwt = window.localStorage.jwt;
    if (jwt) { headers.Authorization = `Bearer ${window.localStorage.jwt}`; }
  }
  return headers;
}

// const transport = new SocketTransport({
//   url: "ws://localhost:4000/graphql", //`ws://${window.location.host}${process.env.API_URL}`,
//   headers: buildHeaders(),
// });

// export const client = createClient(
//   `ws://${window.location.host}/api/graphql`,
//   buildHeaders()
// );

export const client = createClient(
  `ws://localhost:4000/api/graphql`,
  buildHeaders()
);
