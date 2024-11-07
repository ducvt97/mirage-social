import type { PostDetail } from "../component";
import type { PostSchema, UserSchema } from "../schema";
import type { ServerResponse } from "../server-response";

interface GetPostsByUserResponseData {
  posts: PostDetail[];
}

export interface PostCreateResponse extends ServerResponse {
  data?: PostSchema;
  error?: string;
}

export interface GetPostsByUserResponse extends ServerResponse {
  data?: GetPostsByUserResponseData;
  error?: string;
}

export interface LikePostResponse extends ServerResponse {
  data?: { likes: number };
  error?: string;
}
