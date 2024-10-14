export interface Error {
  [key: string]: string;
}

export interface ServerResponse {
  success: boolean;
  status: number;
  message: string;
  data?: any;
  error?: string | Error | null;
}
