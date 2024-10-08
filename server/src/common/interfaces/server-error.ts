import { HttpStatus } from '@nestjs/common';

export interface Error {
  [key: string]: string;
}

export interface IServerError {
  message: string;
  status: number;
  error: string | string[] | Error | null;
}

export class ServerError implements IServerError {
  readonly message = HttpStatus[HttpStatus.BAD_REQUEST];
  readonly status: number = HttpStatus.BAD_REQUEST;
  error: string | string[] | Error | null;

  constructor(error = null) {
    this.error = error;
  }
}
