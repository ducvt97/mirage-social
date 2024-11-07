export interface CreatePostRequest {
  caption: string;
  status: StatusType;
}

export interface LikePostRequest {
  postId: string;
}
