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
  const { showError } = useToastMessage();

  try {
    const response = await $api<T>(url, { ...options, method });
    return response;
  } catch (error) {
    showError("Internal Server Error");
    return Promise.reject("Internal Server Error");
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
