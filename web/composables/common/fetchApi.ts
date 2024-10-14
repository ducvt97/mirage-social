import type { UseFetchOptions } from "nuxt/app";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";
import { handleError } from "./handleError";
import type { ServerResponse } from "~/common/interfaces";

export const useApiClient = async <T extends ServerResponse>(
  url: string,
  method: "get" | "post" | "patch" | "put" | "delete",
  options?: NitroFetchOptions<NitroFetchRequest>
): Promise<T | undefined> => {
  const { $api } = useNuxtApp();
  try {
    const response = await $api<T>(url, { ...options, method });
    const { success } = response;

    if (!success) {
      return Promise.reject(response);
    }

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useApi = async <T>(
  path: string,
  method: "get" | "post" | "patch" | "put" | "delete",
  options?: UseFetchOptions<T>
): Promise<T | undefined> => {
  const response = await useFetch(`/${path}`, {
    ...options,
    method,
    $fetch: useNuxtApp().$api,
  });

  const error = handleError(response);

  if (error) {
    return Promise.reject(error);
  }

  const { data } = response;

  return data.value as T;
};
