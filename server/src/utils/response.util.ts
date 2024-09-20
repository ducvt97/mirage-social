import { Error, ServerResponse } from 'src/common/interfaces/response';

export function handleResponse(data?: any, message?: string) {
  return new ServerResponse({ data, message });
}

export function handleError(errors: string | string[] | Error[]) {
  return new ServerResponse({ success: false, errors });
}
