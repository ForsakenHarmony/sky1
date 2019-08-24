import { registerEnumType } from "type-graphql";

export enum Role {
  User = "USER",
  Admin = "ADMIN",
}

registerEnumType(Role, {
  name: "Role",
});

export enum Status {
  Wip = "WIP",
  Completed = "COMPLETED",
}

registerEnumType(Status, {
  name: "Status",
});
