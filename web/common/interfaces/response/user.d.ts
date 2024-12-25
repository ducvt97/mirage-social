import type { UserSchema } from "../schema";
import type { ServerResponse } from "../server-response";

export interface GetUserInfoResponse extends ServerResponse {
  data?: UserSchema;
  error?: string;
}
