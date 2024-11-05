import type { PostSchema } from "../schema";
import type { ServerResponse } from "../server-response";

export interface PostCreateResponse extends ServerResponse {
  data?: PostSchema;
  error?: string;
}

export interface GetPostsByUserResponse extends ServerResponse {
  data?: PostSchema[];
  error?: string;
}