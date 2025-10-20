import { ServerResponse } from "@/interfaces";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

const apiFetch = async <T extends ServerResponse>(
  url: string,
  method: "get" | "post" | "patch" | "put" | "delete",
  options: RequestInit
) => {
  try {
    const token = localStorage.getItem("auth-token") || "";
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    });
    return response.json() as Promise<T>;
  } catch (error: any) {
    if (error.statusCode === 401) {
      // logout();
      // navigateTo("/login");
      console.log(error);
    }
    // showError("Internal Server Error");
    return Promise.reject(error);
  }
};

const apiServerFetch = async <T extends ServerResponse>(
  url: string,
  method: "get" | "post" | "patch" | "put" | "delete",
  options?: RequestInit,
  queryParams?: Record<string, any>
) => {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("auth-token")?.value || "";
    const response = await fetch(
      baseUrl + url + buildQueryString(queryParams),
      {
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
      }
    );
    return response.json() as Promise<T>;
  } catch (error: any) {
    if (error.statusCode === 401) {
      // logout();
      // navigateTo("/login");
      console.log(error);
    }
    return Promise.reject(error);
  }
};

const buildQueryString = (params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) return "";

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

export { apiFetch, apiServerFetch, buildQueryString };
