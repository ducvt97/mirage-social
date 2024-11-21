import type { CommentDetail } from "../component";
import type { CommentSchema } from "../schema";
import type { ServerResponse } from "../server-response";

export interface CommentOnPostResponse extends ServerResponse {
  data?: CommentSchema;
  error?: string;
}

export interface GetCommentsByPostResponse extends ServerResponse {
  data?: CommentDetail[];
  error?: string;
}
