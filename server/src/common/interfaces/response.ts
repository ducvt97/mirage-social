export interface Error {
  [key: string]: string;
}

export interface IResponse {
  success: boolean;
  error: string | string[] | Error | null;
  message: string;
  data: any;
  status: number;
}

export class ServerResponse implements IResponse {
  success: boolean;
  error: string | string[] | Error | null;
  message: string | null;
  data: any;
  status: number;

  constructor({
    success = true,
    error = null,
    message = null,
    data = null,
    status = 200,
  }) {
    this.success = success;
    this.error = error;
    this.message = message;
    this.data = data;
    this.status = status;
  }
}
