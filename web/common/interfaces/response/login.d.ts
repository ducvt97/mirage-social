import type { ServerResponse } from "../server-response";

interface LoginResponseData {
  token: string;
  user: any;
}

export interface LoginResponse extends ServerResponse {
  data: LoginResponseData;
}
