export interface IResponse {
  message: string;
  data: any;
  status: number;
}

export class ServerResponse implements IResponse {
  message: string | null;
  data: any;
  status: number;

  constructor({ message = null, data = null, status = 200 }) {
    this.message = message;
    this.data = data;
    this.status = status;
  }
}
