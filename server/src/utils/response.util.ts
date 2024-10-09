import { ServerResponse, ServerError, Error } from 'src/common/interfaces';

export function handleResponse(data: any, message?: string) {
  return new ServerResponse({ data, message });
}

export function handleError(error: string | string[] | Error) {
  return new ServerError(error);
}
