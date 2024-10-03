import type { UseFetchOptions } from "nuxt/app";

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

export const usePostApi = async <T>(path: string, body?: object) => {
  return useApi<T>(`/${path}`, {
    method: "POST",
    body,
  });
};

export const useGetApi = async <T>(path: string, params?: object) => {
  return useApi<T>(`/${path}`, {
    method: "GET",
    params,
  });
};
