import type { CommentSchema } from "../schema";
import type { ServerResponse } from "../server-response";

export interface CommentOnPostResponse extends ServerResponse {
  data?: CommentSchema;
  error?: string;
}
