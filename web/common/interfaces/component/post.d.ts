import type { PostSchema, UserSchema } from "../schema";

export interface PostDetail extends PostSchema {
  userDetails: UserSchema;
}
