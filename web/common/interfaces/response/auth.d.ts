import type { UserCommonInfo } from "../global";
import type { Error, ServerResponse } from "../server-response";

interface LoginResponseData {
  token: string;
  user: UserCommonInfo;
}

export interface LoginResponse extends ServerResponse {
  data?: LoginResponseData;
  error?: string;
}

export interface RegisterResponse extends ServerResponse {
  error?: Error;
}
