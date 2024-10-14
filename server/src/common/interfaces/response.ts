export interface IResponse {
  success: boolean;
  message: string;
  status: number;
}

export class ServerResponse implements IResponse {
  readonly success = true;
  message: string;
  data: any;
  readonly status = 200;

  constructor({ message = 'Success', data = null }) {
    this.message = message;
    this.data = data;
  }
}
