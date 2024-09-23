import { STATUS_CODES } from 'http';
import { Error, ServerResponse } from 'src/common/interfaces/response';

export function handleResponse(data?: any, status?: number, message?: string) {
  return new ServerResponse({ data, message, status });
}

export function handleError(
  error: string | string[] | Error,
  status = 400,
  message = STATUS_CODES[400],
) {
  return new ServerResponse({ success: false, error, status, message });
}
