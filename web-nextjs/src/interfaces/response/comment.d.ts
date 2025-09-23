import type { CommentDetail } from "../component";
import type { CommentSchema } from "../schema";
import type { ServerResponse } from "../server-response";

export interface CommentOnPostResponse extends ServerResponse {
  data?: CommentDetail;
  error?: string;
}

export interface GetCommentsByPostResponse extends ServerResponse {
  data?: CommentDetail[];
  error?: string;
}

export interface GetCommentsByCommentResponse
  extends GetCommentsByPostResponse {}

interface LikeCommentResponseData {
  likes: number;
  usersLike: string[];
}

export interface LikeCommentResponse extends ServerResponse {
  data?: LikeCommentResponseData;
  error?: string;
}

export interface UpdateCommentResponse extends ServerResponse {
  data?: CommentSchema;
  error?: string;
}
