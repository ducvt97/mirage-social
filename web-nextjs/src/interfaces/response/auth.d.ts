import type { UserSchema } from "../schema";
import type { Error, ServerResponse } from "../server-response";

interface LoginResponseData {
  token: string;
  user: UserSchema;
}

export interface LoginResponse extends ServerResponse {
  data?: LoginResponseData;
  error?: string;
}

export interface RegisterResponse extends ServerResponse {
  error?: Error;
}
