export interface Error {
    [key: string]: string;
}

export interface IResponse {
  success: boolean;
  errors: string | string[] | Error[] | null;
  message: string;
  data: any;
}

export class ServerResponse implements IResponse {
  success: boolean;
  errors: string | string[] | Error[] | null;
  message: string;
  data: any;

  constructor({ success = true, errors = null, message = '', data = null }) {
    this.success = success;
    this.errors = errors;
    this.message = message;
    this.data = data;
  }
}
