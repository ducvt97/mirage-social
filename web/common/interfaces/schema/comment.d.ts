export interface CommentSchema {
  _id: string;
  caption: string;
  content: string;
  likes: number;
  usersLike: string[];
  userId: string;
  postId: string;
  replies: number;
  replyComments: string[];
  replyCommentId: string;
}
