import type { ServerResponse } from "~/common/interfaces";

const handleError = (response: any): ServerResponse | undefined => {
  const { logout } = useAuth();
  const { data, error } = response;

  if (error.value) {
    const serverError: ServerResponse = {
      success: false,
      status: error.value.statusCode || 400,
      message: error.value.cause?.message || "Bad request",
      error: error.value.cause?.message || "Bad request",
    };

    if (error.value.statusCode === 401) {
      logout();
    }

    return serverError;
  }

  if (!data.value?.success) {
    const serverError: ServerResponse = {
      success: false,
      status: data.value.status || 400,
      message: data.value.message || "Bad request",
      error: data.value.error || "Bad request",
    };

    if (error.value.status === 401) {
      logout();
    }

    return serverError;
  }

  return undefined;
};

export { handleError };
