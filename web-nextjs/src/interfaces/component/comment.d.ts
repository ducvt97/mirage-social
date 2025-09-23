import type { CommentSchema, UserSchema } from "../schema";

export interface CommentDetail extends CommentSchema {
  userDetails: UserSchema;
}
