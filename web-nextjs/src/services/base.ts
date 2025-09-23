import { ServerResponse } from "@/interfaces";

const apiFetch = async <T extends ServerResponse>(
  url: string,
  method: "get" | "post" | "patch" | "put" | "delete",
  options: RequestInit
) => {
  // Placeholder for common fetch logic
  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      ...options,
    });
    return response.json() as Promise<T>;
  } catch (error: any) {
    if (error.statusCode === 401) {
      // logout();
      // navigateTo("/login");
      return Promise.reject("Unauthorized");
    }
    // showError("Internal Server Error");
    return Promise.reject("Internal Server Error");
  }
};

export { apiFetch };
