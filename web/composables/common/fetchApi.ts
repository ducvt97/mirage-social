import type { UseFetchOptions } from "nuxt/app";
import { handleError } from "./handleError";

export function useApi<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  const config = useRuntimeConfig();

  const fetch = $fetch.create({
    baseURL: config.public.serverEndpoint,
  });

  return useFetch(url, {
    ...options,
    $fetch: fetch,
  });
}

export const usePostApi = async <T>(
  path: string,
  body?: object
): Promise<T | undefined> => {
  const response = await useApi<T>(`/${path}`, {
    method: "POST",
    body,
  });
  // debugger;
  const { data, error } = response;

  const isError = handleError(error.value);

  if (isError) {
    return undefined;
  }

  return data.value as T;
};

export const useGetApi = async <T>(path: string, params?: object) => {
  return useApi<T>(`/${path}`, {
    method: "GET",
    params,
  });
};
