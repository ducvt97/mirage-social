export interface IResponse {
  message: string;
  data: any;
  status: number;
}

export class ServerResponse implements IResponse {
  message: string;
  data: any;
  status: number;

  constructor({ message = 'Success', data = null, status = 200 }) {
    this.message = message;
    this.data = data;
    this.status = status;
  }
}
