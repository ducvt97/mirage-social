import type { UserSchema } from "./schema";

export type UserCommonInfo = Pick<
  UserSchema,
  "_id" | "email" | "avatar" | "firstName" | "lastName"
>;
