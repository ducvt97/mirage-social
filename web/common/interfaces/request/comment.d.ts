import type { GetWithPaging } from "./common";

export interface CommentOnPostRequest {
  caption: string;
  postId: string;
  replyCommentId?: string;
}

export interface GetCommentsByPostRequest extends GetWithPaging {
  postId: string;
}

export interface GetCommentsByCommentRequest extends GetWithPaging {
  commentId: string;
}

export interface LikeCommentRequest {
  commentId: string;
}
