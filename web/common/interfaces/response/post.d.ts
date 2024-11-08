import type { PostDetail } from "../component";
import type { PostSchema, UserSchema } from "../schema";
import type { ServerResponse } from "../server-response";

interface GetPostsByUserResponseData {
  posts: PostDetail[];
}

interface LikePostResponseData {
  likes: number;
  usersLike: string[];
}

interface PostCreateResponseData {
  post: PostSchema;
  user: UserSchema;
}

export interface PostCreateResponse extends ServerResponse {
  data?: PostCreateResponseData;
  error?: string;
}

export interface GetPostsByUserResponse extends ServerResponse {
  data?: GetPostsByUserResponseData;
  error?: string;
}

export interface LikePostResponse extends ServerResponse {
  data?: LikePostResponseData;
  error?: string;
}
