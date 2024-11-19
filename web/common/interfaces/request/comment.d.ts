export class CommentOnPostRequest {
  caption: string;
  postId: string;
  replyCommentId?: string;
}

export class GetCommentsByPostRequest {
  postId: string;
}
