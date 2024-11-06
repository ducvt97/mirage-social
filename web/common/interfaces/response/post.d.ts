import type { PostSchema, UserSchema } from "../schema";
import type { ServerResponse } from "../server-response";

interface GetPostsByUserResponseData {
  posts: PostSchema[];
  user: UserSchema;
}

export interface PostCreateResponse extends ServerResponse {
  data?: PostSchema;
  error?: string;
}

export interface GetPostsByUserResponse extends ServerResponse {
  data?: GetPostsByUserResponseData;
  error?: string;
}
