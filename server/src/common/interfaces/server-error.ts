import { HttpStatus } from '@nestjs/common';
import { IResponse } from './response';

export interface Error {
  [key: string]: string;
}

export interface IServerError extends IResponse {
  error: string | Error | null;
}

export class ServerError implements IServerError {
  readonly success = false;
  readonly message = HttpStatus[HttpStatus.BAD_REQUEST];
  readonly status: number = HttpStatus.BAD_REQUEST;
  error: string | Error | null;

  constructor(error = null) {
    this.error = error;
  }
}
