export interface CreatePostRequest {
  caption: string;
  status: PostStatusType;
}

export interface LikePostRequest {
  postId: string;
}

export interface UpdatePostRequest {
  id: string;
  caption: string;
  status: PostStatusType;
}
