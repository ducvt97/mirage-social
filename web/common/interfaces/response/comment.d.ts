import type { CommentDetail } from "../component";
import type { ServerResponse } from "../server-response";

export interface CommentOnPostResponse extends ServerResponse {
  data?: CommentDetail;
  error?: string;
}

export interface GetCommentsByPostResponse extends ServerResponse {
  data?: CommentDetail[];
  error?: string;
}
