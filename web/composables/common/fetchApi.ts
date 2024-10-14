import type { UseFetchOptions } from "nuxt/app";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";
import { handleError } from "./handleError";
import type { ServerResponse } from "~/common/interfaces";

export const useApiClient = async <T extends NitroFetchRequest>(
  url: string,
  method: "get" | "post" | "patch" | "put" | "delete",
  options?: NitroFetchOptions<T>
) => {
  const { $api } = useNuxtApp();
  try {
    const response = await $api(url, { ...options, method });
    console.log(response);
    const error = handleError(response);
    if (error) {
      return Promise.reject(error);
    }

    const serverResponse: ServerResponse = {
      success: true,
      status: 200,
      message: "abc",
    };
  
    return serverResponse;
  } catch (error) {
    console.log(error);
    
    return Promise.reject(error);
  }
};

export const useApi = async <T>(
  path: string,
  method: "get" | "post" | "patch" | "put" | "delete",
  options?: UseFetchOptions<T>
): Promise<ServerResponse | undefined> => {
  const response = await useFetch(`/${path}`, {
    ...options,
    method,
    $fetch: useNuxtApp().$api,
  });

  const error = handleError(response);

  console.log(response);
  if (error) {
    return Promise.reject(error);
  }

  const { data } = response;
  console.log(data);

  const serverResponse: ServerResponse = {
    success: true,
    status: 200,
    message: "abc",
  };

  return serverResponse;
};
